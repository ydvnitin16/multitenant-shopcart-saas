import express from "express";
import { allowedRoles, auth } from "../middlewares/auth.middlewares.js";
import { validateCreateStoreForm } from "../middlewares/validate/store.validate.js";
import {
    createStoreRequest,
    getStoreOrders,
    getUserStores,
} from "../controllers/store.controller.js";
import multer from "multer";

const router = express.Router();
const uploads = multer({ storage: multer.memoryStorage() });

router.post(
    "/create-request",
    auth,
    uploads.single("image"),
    validateCreateStoreForm,
    createStoreRequest,
);
router.get("/user-stores", auth, getUserStores);
router.get("/orders/:storeId", auth, allowedRoles('VENDOR'), getStoreOrders)

export default router;
