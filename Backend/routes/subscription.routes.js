import express from "express";
import {
    cancelSubscription,
    createSubscriptionCheckoutSession,
    getStoreSubscription,
    upgradeSubscription,
} from "../controllers/stripe.controller.js";
import { auth, allowedRoles } from "../middlewares/auth.middlewares.js";
import { resolveTenant } from "../middlewares/store.middleware.js";

const router = express.Router();

router.get(
    "/stores/:storeId",
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

router.patch(
    "/stores/:storeId/cancel",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    cancelSubscription,
);

router.patch('/stores/:storeId/upgrade',auth, allowedRoles('VENDOR'), resolveTenant, upgradeSubscription)

export default router;
