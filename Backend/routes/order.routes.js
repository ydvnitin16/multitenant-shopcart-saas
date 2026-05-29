import express from 'express';
import { auth } from '../middlewares/auth.middlewares.js';
import {
    cancelUserStoreOrder,
    getUserOrders,
    placeOrder,
} from '../controllers/order.controller.js';

const router = express.Router();

// Order Routes -> user orders
router.get('/', auth, getUserOrders);
router.post("/", auth, placeOrder);
router.patch("/:id/cancel", auth, cancelUserStoreOrder);

export default router;
