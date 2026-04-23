import mongoose from "mongoose";

const parentOrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            required: true,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        stripeSessionId: {
            type: String,
            default: null,
        },
        stripePaymentIntentId: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

const ParentOrder = mongoose.model("ParentOrder", parentOrderSchema);

export default ParentOrder;
