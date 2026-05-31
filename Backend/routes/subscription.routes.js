import express from "express";
import {
    createSubscriptionCheckoutSession,
    getStoreSubscription,
} from "../controllers/stripe.controller.js";
import { auth, allowedRoles } from "../middlewares/auth.middlewares.js";
import { resolveTenant } from "../middlewares/store.middleware.js";

const router = express.Router();

router.get(
    "/stores/:storeId/current",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    getStoreSubscription,
);

router.post(
    "/checkout",
    auth,
    allowedRoles("VENDOR"),
    createSubscriptionCheckoutSession,
);

export default router;
