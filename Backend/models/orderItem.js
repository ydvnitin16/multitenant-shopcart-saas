import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    storeOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StoreOrder",
        required: true,
    },
    price: { type: Number, required: true },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
