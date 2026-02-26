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
    getCartProducts,
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
router.get("/products/cart", getCartProducts);

export default router;
