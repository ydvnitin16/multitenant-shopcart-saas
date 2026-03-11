import ParentOrder from "../models/parentOrder.js";
import StoreOrder from "../models/storeOrder.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";

export const placeOrderService = async ({
    userId,
    items,
    paymentMethod,
    addressId,
}) => {
    /*
    items coming from frontend

    [
        { productId, quantity }
    ]
    */

    if (!items || items.length === 0) {
        throw new Error("Cart is empty");
    }

    const productIds = items.map((i) => i.productId);

    const products = await Product.find({
        _id: { $in: productIds },
    });

    if (products.length === 0) {
        throw new Error("Products not found");
    }

    /*
    Map products by id for fast lookup
    */

    const productMap = {};

    products.forEach((product) => {
        productMap[product._id] = product;
    });

    /*
    Group products by store
    */

    const storeGroups = {};

    let parentTotal = 0;

    for (const item of items) {
        const product = productMap[item.productId];

        if (!product) {
            throw new Error("Product not found");
        }

        const storeId = product.storeId.toString();

        if (!storeGroups[storeId]) {
            storeGroups[storeId] = [];
        }

        const price = product.price;
        const total = price * item.quantity;

        parentTotal += total;

        storeGroups[storeId].push({
            productId: product._id,
            quantity: item.quantity,
            price,
        });
    }

    /*
    Create Parent Order
    */
    console.log({
        userId,
        totalAmount: parentTotal,
        paymentMethod,
        isPaid: paymentMethod === "COD" ? false : true, // stripe will update later
    });
    const parentOrder = await ParentOrder.create({
        userId,
        totalAmount: parentTotal,
        paymentMethod,
        isPaid: paymentMethod === "COD" ? false : true, // stripe will update later
    });

    /*
    Create Store Orders
    */

    for (const storeId in storeGroups) {
        const items = storeGroups[storeId];

        const storeTotal = items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );

        const storeOrder = await StoreOrder.create({
            parentOrderId: parentOrder._id,
            storeId,
            addressId,
            totalAmount: storeTotal,
            isPaid: paymentMethod === "COD" ? false : false,
        });

        /*
        Create Order Items
        */

        const orderItems = items.map((item) => ({
            storeOrderId: storeOrder._id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        await OrderItem.insertMany(orderItems);
    }

    /*
    Payment Logic
    */

    if (paymentMethod === "STRIPE") {
        /*
        TODO:

        Create Stripe session here

        return session url to frontend
        */
    }

    return parentOrder;
};
export const getUserOrdersService = async (userId) => {
    // 1️⃣ Get parent orders
    const parentOrders = await ParentOrder.find({ userId })
        .sort({ createdAt: -1 })
        .lean();

    if (!parentOrders.length) return [];

    const parentOrderIds = parentOrders.map((o) => o._id);

    // 2️⃣ Get store orders
    const storeOrders = await StoreOrder.find({
        parentOrderId: { $in: parentOrderIds },
    })
        .populate("storeId", "name slug")
        .populate("addressId")
        .lean();

    const storeOrderIds = storeOrders.map((o) => o._id);

    // 3️⃣ Get order items
    const orderItems = await OrderItem.find({
        storeOrderId: { $in: storeOrderIds },
    })
        .populate("productId", "name images price slug")
        .lean();

    // 4️⃣ Group items by storeOrder
    const itemsMap = {};

    for (const item of orderItems) {
        const storeId = item.storeOrderId.toString();

        if (!itemsMap[storeId]) {
            itemsMap[storeId] = [];
        }

        itemsMap[storeId].push({
            _id: item._id,
            product: item.productId,
            quantity: item.quantity,
            price: item.price,
        });
    }

    // 5️⃣ Group storeOrders by parentOrder
    const storeOrdersMap = {};

    for (const order of storeOrders) {
        const parentId = order.parentOrderId.toString();

        if (!storeOrdersMap[parentId]) {
            storeOrdersMap[parentId] = [];
        }

        storeOrdersMap[parentId].push({
            _id: order._id,
            store: order.storeId,
            address: order.addressId,
            status: order.status,
            totalAmount: order.totalAmount,
            items: itemsMap[order._id.toString()] || [],
        });
    }

    // 6️⃣ Attach storeOrders to parentOrders
    const finalOrders = parentOrders.map((order) => ({
        ...order,
        storeOrders: storeOrdersMap[order._id.toString()] || [],
    }));

    return finalOrders;
};
