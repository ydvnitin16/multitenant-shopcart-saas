import express from "express";
import {
    getCartProducts,
    getProduct,
    getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.get("/cart", getCartProducts);

export default router;
