import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    storeOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StoreOrder",
        required: true,
    },
    price: { type: Number, required: true },
    productNameSnapshot: { type: String, required: true },
    productImageSnapshot: { type: String, required: true },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
