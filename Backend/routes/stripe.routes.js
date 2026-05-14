import express from "express";
import {
    createCheckoutSession,
} from "../controllers/stripe.controller.js";

const router = express.Router();

router.post("/checkout", express.json(), createCheckoutSession);

export default router;
