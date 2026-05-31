import express from "express";
import { allowedRoles, auth } from "../middlewares/auth.middlewares.js";
import {
    isStoreApproved,
    resolveTenant,
} from "../middlewares/store.middleware.js";
import { attachPlanFeatures, enforceProductLimit } from "../middlewares/subscription.middleware.js";
import { validateCreateStoreForm } from "../middlewares/validate/store.validate.js";
import {
    createStoreRequest,
    getStoreFront,
    getStoreOrders,
    getStoreStats,
    getTenantStores,
} from "../controllers/store.controller.js";
import multer from "multer";
import { updateStoreOrderStatus } from "../controllers/order.controller.js";
import {
    validateProduct,
    validateProductUpdate,
} from "../middlewares/validate/product.validate.js";
import {
    createProduct,
    deleteProduct,
    getMyStoreProducts,
    updateProduct,
} from "../controllers/product.controller.js";

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
    "/:storeId/stats",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    getStoreStats,
);

router.get(
    "/:storeId/orders",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    getStoreOrders,
);

router.patch(
    "/orders/:id/status",
    auth,
    allowedRoles("VENDOR"),
    updateStoreOrderStatus,
);

router.get("/:storeSlug", getStoreFront);

// Store's Products
router.post(
    "/:storeId/products",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    attachPlanFeatures,
    enforceProductLimit,
    uploads.array("images"),
    validateProduct,
    createProduct,
);

router.get(
    "/:storeId/products",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    getMyStoreProducts,
);

router.put(
    "/:storeId/products/:productId/update",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    validateProductUpdate,
    updateProduct,
);

router.delete(
    "/:storeId/products/:productId",
    auth,
    allowedRoles("VENDOR"),
    resolveTenant,
    isStoreApproved,
    deleteProduct,
);

export default router;
