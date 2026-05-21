import express from "express";
import { allowedRoles, auth } from "../middlewares/auth.middlewares.js";
import {
    getAdminStats,
    getStores,
    updateStoreActivation,
    updateStoreStatus,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/stats", auth, allowedRoles("ADMIN"), getAdminStats);
router.get("/stores", auth, allowedRoles("ADMIN"), getStores);
router.patch(
    "/stores/:storeId/status",
    auth,
    allowedRoles("ADMIN"),
    updateStoreStatus,
);
router.patch(
    "/stores/:storeId/activation",
    auth,
    allowedRoles("ADMIN"),
    updateStoreActivation,
);

export default router;
