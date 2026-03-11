import mongoose from "mongoose";

const storeOrderSchema = new mongoose.Schema(
    {
        parentOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ParentOrder",
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        storeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        addressId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        status: {
            type: String,
            enum: ["ORDER_PLACED", "SHIPPED", "DELIVERED"],
            default: "ORDER_PLACED",
        },
    },
    { timestamps: true },
);

const StoreOrder = mongoose.model("StoreOrder", storeOrderSchema);

export default StoreOrder;
