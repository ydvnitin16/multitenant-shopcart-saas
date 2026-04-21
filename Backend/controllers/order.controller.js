// import Order from "../models/order.js";
import Product from "../models/product.js";
import ApiError from "../utils/apiError.js";
import {
    getUserOrdersService,
    placeOrderService,
} from "../services/order.service.js";

// User place order -> save in the DB
export const placeOrder = async (req, res) => {
    const userId = req.user.id;

    const { items, paymentMethod, addressId } = req.body;

    if (!addressId) throw new ApiError(400, "Please fill the address details.");
    if (!paymentMethod)
        throw new ApiError(400, "Please select the payment method.");

    const order = await placeOrderService({
        userId,
        items,
        paymentMethod,
        addressId,
    });

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
    });
};

// User history to check order -> get orders for that user
export const getUserOrders = async (req, res) => {
    const userId = req.user.id;
    const orders = await getUserOrdersService(userId);

    res.status(200).json({
        success: true,
        orders,
    });
};

// // Admin -> get all orders to manage
// const allOrders = async (req, res) => {
//     try {
//         const orders = await Order.find().populate("userId", "name email");

//         if (!orders) return res.status(404).json({ message: "No Orders" });

//         res.status(200).json({ message: "User Orders", orders });
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error, please try again later.",
//         });
//     }
// };

// // Admin -> Updates status of delivery
// const updateStatus = async (req, res) => {
//     const { id } = req.params;
//     const allowedStatus = [
//         "pending",
//         "shipped",
//         "out for delivery",
//         "delivered",
//     ];
//     const { status } = req.body;
//     try {
//         const order = await Order.findById(id);
//         console.log(order.items[0].product._id);
//         if (!order)
//             return res.status(404).json({
//                 message: "Order not found",
//             });

//         if (!allowedStatus.includes(status))
//             return res.status(404).json({
//                 message: "Please select valid status",
//             });

//         if (status === "delivered") {
//             for (let item of order.items) {
//                 try {
//                     const id = item.product._id;
//                     const product = await Product.findById(id);
//                     product.itemSold = product.itemSold + item.quantity;
//                     product.save();
//                 } catch (error) {
//                     res.status(500).json({
//                         message: "Server error, please try again later.",
//                     });
//                 }
//             }
//         }

//         order.status = status;
//         await order.save();
//         res.status(200).json({ message: "Status Updated" });
//     } catch (error) {
//         res.status(500).json({
//             message: "Server error, please try again later.",
//         });
//     }
// };

// export { placeOrder, userOrders, allOrders, updateStatus };
