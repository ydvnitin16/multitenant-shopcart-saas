import ParentOrder from "../models/parentOrder.js";
import StoreOrder from "../models/storeOrder.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";

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
        throw new Error("Cart is empty");
    }

    const productIds = items.map((item) => item.product || item.productId);

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
        productMap[product._id.toString()] = product;
    });

    /*
    Group products by store
    */

    const storeGroups = {};

    let parentTotal = 0;

    for (const item of items) {
        const requestedProductId = item.product || item.productId;
        const product = productMap[requestedProductId];

        if (!product) {
            throw new Error("Product not found");
        }

        const storeId = product.store.toString();

        if (!storeGroups[storeId]) {
            storeGroups[storeId] = [];
        }

        const price = product.price;
        const total = price * item.quantity;

        parentTotal += total;

        storeGroups[storeId].push({
            product: product._id,
            quantity: item.quantity,
            price,
            name: product.name,
            image: product.images[0],
        });
    }

    /*
    Create Parent Order
    */
    console.log({
        user,
        totalAmount: parentTotal,
        paymentMethod,
        isPaid: paymentMethod === "COD" ? false : true, // stripe will update later
    });
    const parentOrder = await ParentOrder.create({
        user,
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
            parentOrder: parentOrder._id,
            store: storeId,
            address,
            totalAmount: storeTotal,
            isPaid: paymentMethod === "COD" ? false : false,
        });

        /*
        Create Order Items
        */

        const orderItems = items.map((item) => ({
            storeOrder: storeOrder._id,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image,
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
export const getUserOrdersService = async (user) => {
    // 1️⃣ Get parent orders
    const parentOrders = await ParentOrder.find({ user })
        .sort({ createdAt: -1 })
        .lean();

    if (!parentOrders.length) return [];

    const parentOrderIds = parentOrders.map((o) => o._id);

    // 2️⃣ Get store orders
    const storeOrders = await StoreOrder.find({
        parentOrder: { $in: parentOrderIds },
    })
        .populate("store", "name slug")
        .populate("address")
        .lean();

    const storeOrderIds = storeOrders.map((o) => o._id);

    // 3️⃣ Get order items
    const orderItems = await OrderItem.find({
        storeOrder: { $in: storeOrderIds },
    })
        .populate("product", "name images price slug")
        .lean();

    // 4️⃣ Group items by storeOrder
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
            name: item.name,
            image: item.image,
        });
    }

    // 5️⃣ Group storeOrders by parentOrder
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
