import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        plan: {
            type: String,
            enum: ["FREE", "STARTER", "PRO"],
            required: true,
            default: 'FREE'
        },
        status: {
            type: String,
            enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
            required: true,
            default: "ACTIVE",
        },
        stripeSubscriptionId: {
            type: String,
            default: null,
        },
        stripeInvoiceId: {
            type: String,
            default: null,
        },
        amountPaid: {
            type: Number,
            default: 0,
            min: 0,
        },
        currentPeriodStart: {
            type: Date,
            default: null,
        },
        currentPeriodEnd: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
