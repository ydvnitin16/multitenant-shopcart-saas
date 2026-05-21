import express from "express";
import {
    cancelCheckoutSession,
    createCheckoutSession,
} from "../controllers/stripe.controller.js";
import { auth } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/checkout", auth, express.json(), createCheckoutSession);
router.post("/checkout/cancel", auth, express.json(), cancelCheckoutSession);

export default router;
