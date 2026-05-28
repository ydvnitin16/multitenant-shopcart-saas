import express from "express";
import { allowedRoles, auth } from "../middlewares/auth.middlewares.js";
import {
    isStoreApproved,
    resolveTenant,
} from "../middlewares/store.middleware.js";
import { validateCreateStoreForm } from "../middlewares/validate/store.validate.js";
import {
    createStoreRequest,
    getStoreFront,
    getStoreOrders,
    getStoreStats,
    getTenantStores,
} from "../controllers/store.controller.js";
import multer from "multer";

const router = express.Router();
const uploads = multer({ storage: multer.memoryStorage() });

router.post(
    "/request",
    auth,
    uploads.single("image"),
    validateCreateStoreForm,
    createStoreRequest,
);
router.get("/", auth, getTenantStores);
router.get(
    "/:storeSlug/stats",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    getStoreStats,
);
router.get("/:storeSlug", getStoreFront);

export default router;
