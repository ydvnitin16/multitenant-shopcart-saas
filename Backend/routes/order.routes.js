import express from 'express';
import { validateOrder } from '../middlewares/order.js';
import { auth } from '../middlewares/auth.middlewares.js';
import { getUserOrders, placeOrder } from '../controllers/order.controller.js';

const router = express.Router();

// Order Routes -> user orders
router.post('/', auth, validateOrder, placeOrder);
router.get('/my-orders', auth, getUserOrders);
router.post("/place-order", auth, placeOrder);

export default router;
