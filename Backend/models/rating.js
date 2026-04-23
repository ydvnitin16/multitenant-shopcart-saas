import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        rating: { type: Number, min: 0, max: 5, required: true },
        review: { type: String },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
    },
    { timestamps: true },
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
