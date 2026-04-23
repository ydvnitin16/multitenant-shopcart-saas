import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        slug: { type: String, required: true, unique: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["APPROVED", "PENDING", "REJECTED"],
            required: true,
            default: "PENDING",
        },
        address: { type: String, required: true },
        isActive: { type: Boolean, required: true, default: false },
        image: {
            type: {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
            },
            default: null,
        },
        email: { type: String, required: true },
        contact: { type: String, required: true },
    },
    { timestamps: true },
);

const Store = mongoose.model("Store", storeSchema);

export default Store;
