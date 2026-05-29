import express from "express";
import {
    getCartProducts,
    getProduct,
    getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/cart", getCartProducts);
router.get("/:id", getProduct);

export default router;
