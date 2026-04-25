import mongoose from "mongoose";

const storeOrderSchema = new mongoose.Schema(
    {
        parentOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ParentOrder",
            required: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        vendorEarnings: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        status: {
            type: String,
            enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
            default: "PENDING",
        },
    },
    { timestamps: true },
);

const StoreOrder = mongoose.model("StoreOrder", storeOrderSchema);

export default StoreOrder;
