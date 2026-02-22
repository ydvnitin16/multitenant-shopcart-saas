import express from "express";
import Product from "../models/product.js";
import { allowedRoles, auth } from "../middlewares/auth.middlewares.js";
import {
    isStoreApproved,
    resolveTenant,
} from "../middlewares/store.middleware.js";
import {
    validateProduct,
    validateProductUpdate,
} from "../middlewares/validate/product.validate.js";
import {
    createProduct,
    getMyStoreProducts,
    getProduct,
    getProducts,
    updateProduct,
} from "../controllers/product.controller.js";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

const router = express.Router();
const uploads = multer({ storage });

router.post(
    "/:storeSlug/create-product",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    uploads.array("images"),
    validateProduct,
    createProduct,
);

router.put(
    "/:storeSlug/product/:productId/update",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    validateProductUpdate,
    updateProduct,
);

router.get(
    "/:storeSlug/products",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    getMyStoreProducts,
);

// User -> Shop -> Show products
router.get("/products", getProducts);

// Product Route -> Show details about product
router.get("/product/:productId", getProduct);

// Get products by array of IDs (cart)
router.post("/products/cart", async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
        return res
            .status(400)
            .json({ message: "Invalid or missing IDs array" });
    }

    try {
        const products = await Product.find({ _id: { $in: ids } });

        if (!products || products.length === 0) {
            return res
                .status(404)
                .json({ message: "No products found for given IDs" });
        }

        res.status(200).json({ message: "Cart Products", products });
    } catch (error) {
        res.status(500).json({
            message: "Server error. please try again later.",
        });
    }
});

export default router;
