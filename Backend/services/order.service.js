import ParentOrder from "../models/parentOrder.js";
import StoreOrder from "../models/storeOrder.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";
import Address from "../models/address.js";
import ApiError from "../utils/apiError.js";

const STORE_ORDER_STATUSES = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

const restoreStoreOrderStock = async (storeOrderId) => {
    const orderItems = await OrderItem.find({
        storeOrder: storeOrderId,
    }).lean();

    await Promise.all(
        orderItems.map((item) =>
            Product.updateOne(
                { _id: item.product },
                {
                    $inc: {
                        stock: item.quantity,
                    },
                },
            ),
        ),
    );
};

const syncParentOrderPaymentStatus = async (parentOrderId) => {
    const activeStoreOrders = await StoreOrder.find({
        parentOrder: parentOrderId,
        status: { $ne: "CANCELLED" },
    })
        .select("isPaid")
        .lean();

    const isPaid =
        activeStoreOrders.length > 0 &&
        activeStoreOrders.every((order) => order.isPaid);

    await ParentOrder.updateOne({ _id: parentOrderId }, { isPaid });
};

const normalizeOrderItems = (items) => {
    const normalizedItemsMap = new Map();

    for (const item of items) {
        const productId = item.product || item.productId;
        const quantity = Number(item.quantity);

        if (!productId) {
            throw new ApiError(400, "Each order item must include a product.");
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new ApiError(
                400,
                "Each order item quantity must be a positive integer.",
            );
        }

        if (normalizedItemsMap.has(productId)) {
            normalizedItemsMap.get(productId).quantity += quantity;
            continue;
        }

        normalizedItemsMap.set(productId, { productId, quantity });
    }

    return Array.from(normalizedItemsMap.values());
};

export const placeOrderService = async ({
    user,
    items,
    paymentMethod,
    address,
}) => {
    /*
    items coming from frontend

    [
        { productId, product, quantity }
    ]
    */

    if (!items || items.length === 0) {
        throw new ApiError(400, "Cart is empty.");
    }

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
        throw new ApiError(400, "Invalid payment method.");
    }

    const deliveryAddress = await Address.findOne({
        _id: address,
        user,
    }).lean();

    if (!deliveryAddress) {
        throw new ApiError(404, "Address not found.");
    }

    const normalizedItems = normalizeOrderItems(items);
    const productIds = normalizedItems.map((item) => item.productId);

    const products = await Product.find({
        _id: { $in: productIds },
    })
        .populate("store", "name isActive status")
        .lean();

    if (products.length !== productIds.length) {
        throw new ApiError(404, "One or more products were not found.");
    }

    const productMap = {};

    products.forEach((product) => {
        productMap[product._id.toString()] = product;
    });

    const storeGroups = {};
    let parentTotal = 0;

    for (const item of normalizedItems) {
        const product = productMap[item.productId];
        const store = product.store;

        if (!store?.isActive || store.status !== "APPROVED") {
            throw new ApiError(
                400,
                `${store?.name ? `${store.name} store` : "This store"} is currently unavailable.`,
            );
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.name} is out of stock for the requested quantity.`,
            );
        }

        const storeId = store._id.toString();

        if (!storeGroups[storeId]) {
            storeGroups[storeId] = {
                store: store._id,
                items: [],
                totalAmount: 0,
            };
        }

        const price = product.price;
        const total = price * item.quantity;

        parentTotal += total;
        storeGroups[storeId].totalAmount += total;
        storeGroups[storeId].items.push({
            product: product._id,
            quantity: item.quantity,
            price,
            productNameSnapshot: product.name,
            productImageSnapshot: product.images?.[0]?.url || "",
        });
    }

    const decrementedProducts = [];
    let parentOrder = null;
    const createdStoreOrderIds = [];

    try {
        for (const item of normalizedItems) {
            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                },
                { new: true },
            );

            if (!updatedProduct) {
                throw new ApiError(
                    400,
                    "One or more items are out of stock. Please refresh your cart.",
                );
            }

            decrementedProducts.push(item);
        }

        parentOrder = await ParentOrder.create({
            user,
            totalAmount: parentTotal,
            paymentMethod,
            isPaid: false,
        });

        for (const storeGroup of Object.values(storeGroups)) {
            const storeOrder = await StoreOrder.create({
                parentOrder: parentOrder._id,
                store: storeGroup.store,
                address,
                totalAmount: storeGroup.totalAmount,
                vendorEarnings: storeGroup.totalAmount,
                isPaid: false,
            });

            createdStoreOrderIds.push(storeOrder._id);

            const orderItems = storeGroup.items.map((item) => ({
                storeOrder: storeOrder._id,
                product: item.product,
                quantity: item.quantity,
                price: item.price,
                productNameSnapshot: item.productNameSnapshot,
                productImageSnapshot: item.productImageSnapshot,
            }));

            await OrderItem.insertMany(orderItems);
        }
    } catch (error) {
        if (decrementedProducts.length > 0) {
            await Promise.all(
                decrementedProducts.map((item) =>
                    Product.updateOne(
                        { _id: item.productId },
                        {
                            $inc: {
                                stock: item.quantity,
                            },
                        },
                    ),
                ),
            );
        }

        if (createdStoreOrderIds.length > 0) {
            await OrderItem.deleteMany({
                storeOrder: { $in: createdStoreOrderIds },
            });
            await StoreOrder.deleteMany({ _id: { $in: createdStoreOrderIds } });
        }

        if (parentOrder?._id) {
            await ParentOrder.deleteOne({ _id: parentOrder._id });
        }

        throw new ApiError(500, "Something went wrong");
    }

    return parentOrder;
};
export const getUserOrdersService = async (user) => {
    // Get parent orders
    const parentOrders = await ParentOrder.find({ user })
        .sort({ createdAt: -1 })
        .lean();

    if (!parentOrders.length) return [];

    const parentOrderIds = parentOrders.map((o) => o._id);

    // Get store orders
    const storeOrders = await StoreOrder.find({
        parentOrder: { $in: parentOrderIds },
    })
        .populate("store", "name slug")
        .populate("address")
        .lean();

    const storeOrderIds = storeOrders.map((o) => o._id);

    // Get order items
    const orderItems = await OrderItem.find({
        storeOrder: { $in: storeOrderIds },
    })
        .populate("product", "name images price ")
        .lean();

    // Group items by storeOrder
    const itemsMap = {};

    for (const item of orderItems) {
        const storeOrderId = item.storeOrder.toString();

        if (!itemsMap[storeOrderId]) {
            itemsMap[storeOrderId] = [];
        }

        itemsMap[storeOrderId].push({
            _id: item._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            name: item.productNameSnapshot,
            image: item.productImageSnapshot,
            productNameSnapshot: item.productNameSnapshot,
            productImageSnapshot: item.productImageSnapshot,
        });
    }

    // Group storeOrders by parentOrder
    const storeOrdersMap = {};

    for (const order of storeOrders) {
        const parentId = order.parentOrder.toString();

        if (!storeOrdersMap[parentId]) {
            storeOrdersMap[parentId] = [];
        }

        storeOrdersMap[parentId].push({
            _id: order._id,
            store: order.store,
            address: order.address,
            status: order.status,
            isPaid: order.isPaid,
            totalAmount: order.totalAmount,
            items: itemsMap[order._id.toString()] || [],
        });
    }

    // Attach storeOrders to parentOrders
    const finalOrders = parentOrders.map((order) => ({
        ...order,
        storeOrders: storeOrdersMap[order._id.toString()] || [],
    }));

    return finalOrders;
};

export const updateStoreOrderStatusService = async ({
    storeOrderId,
    status,
    actorId,
    actorRole,
}) => {
    if (!STORE_ORDER_STATUSES.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    const storeOrder = await StoreOrder.findById(storeOrderId)
        .populate("parentOrder", "user")
        .populate("store", "user");

    if (!storeOrder) {
        throw new ApiError(404, "Order not found");
    }

    if (
        actorRole === "VENDOR" &&
        storeOrder.store?.user?.toString() !== actorId.toString()
    ) {
        throw new ApiError(403, "You can only manage your own store orders");
    }

    if (
        actorRole === "USER" &&
        storeOrder.parentOrder?.user?.toString() !== actorId.toString()
    ) {
        throw new ApiError(403, "You can only cancel your own orders");
    }

    if (storeOrder.status === "CANCELLED") {
        throw new ApiError(400, "This order is already cancelled");
    }

    if (storeOrder.status === "DELIVERED") {
        throw new ApiError(400, "Delivered order can't be updated");
    }

    if (status === "PENDING" && storeOrder.status !== "PENDING") {
        throw new ApiError(400, "Order can't be moved back to pending");
    }

    storeOrder.status = status;

    if (status === "DELIVERED") {
        storeOrder.isPaid = true;
    }

    if (status === "CANCELLED") {
        await restoreStoreOrderStock(storeOrder._id);
        storeOrder.isPaid = false;
    }

    await storeOrder.save();
    await syncParentOrderPaymentStatus(storeOrder.parentOrder._id);

    return storeOrder;
};
