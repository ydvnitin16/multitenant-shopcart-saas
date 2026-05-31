import express from "express";
import {
    createPaymentCheckoutSession,
} from "../controllers/stripe.controller.js";
import { auth } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/checkout", auth, createPaymentCheckoutSession);

export default router;
