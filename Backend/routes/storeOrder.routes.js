import express from "express";
import { allowedRoles, auth } from "../middlewares/auth.middlewares.js";
import { getStoreOrders } from "../controllers/store.controller.js";
import { updateStoreStatus } from "../controllers/admin.controller.js";
import { updateStoreOrderStatus } from "../controllers/order.controller.js";
const router = express.Router();

// Store Order Routes -> store's orders

router.get("/:storeId", auth, allowedRoles("VENDOR"), getStoreOrders);
router.patch(
    "/:id/status",
    auth,
    allowedRoles("VENDOR"),
    updateStoreOrderStatus,
);

export default router;
