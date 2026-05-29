import ApiError from "../utils/apiError.js";
import {
    getUserOrdersService,
    placeOrderService,
    updateStoreOrderStatusService,
} from "../services/order.service.js";

// User place order -> save in the DB
export const placeOrder = async (req, res) => {
    const user = req.user.id;

    const { items, paymentMethod, addressId, address } = req.body;
    const selectedAddress = address || addressId;

    if (!selectedAddress)
        throw new ApiError(400, "Please fill the address details.");
    if (!paymentMethod)
        throw new ApiError(400, "Please select the payment method.");

    const order = await placeOrderService({
        user,
        items,
        paymentMethod,
        address: selectedAddress,
    });

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
    });
};

// User history to check order -> get orders for that user
export const getUserOrders = async (req, res) => {
    const user = req.user.id;
    const orders = await getUserOrdersService(user);

    res.status(200).json({
        success: true,
        orders,
    });
};

// Get store orders
export const updateStoreOrderStatus = async (req, res) => {
    const { id } = req.params;
    const status = req.body.status;
    const storeOrder = await updateStoreOrderStatusService({
        storeOrderId: id,
        status,
        actorId: req.user.id,
        actorRole: req.user.role,
    });

    res.status(200).json({ success: true, storeOrder });
};

export const cancelUserStoreOrder = async (req, res) => {
    const { id } = req.params;
    const storeOrder = await updateStoreOrderStatusService({
        storeOrderId: id,
        status: "CANCELLED",
        actorId: req.user.id,
        actorRole: "USER",
    });

    res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        storeOrder,
    });
};
