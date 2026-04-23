import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Store",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        mrp: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 1,
        },
        images: {
            type: [
                {
                    url: { type: String, required: true },
                    public_id: { type: String, required: true },
                },
            ],
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
