import express from 'express';
import { validateOrder } from '../middlewares/order.js';
import { auth } from '../middlewares/auth.middlewares.js';
import { placeOrder, userOrders } from '../controllers/orderController.js';

const router = express.Router();

// Order Routes -> user orders
router.post('/', auth, validateOrder, placeOrder);
router.get('/user', auth, userOrders);

export default router;
