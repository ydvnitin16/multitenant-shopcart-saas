import express from 'express';
import { allowedRoles, auth } from '../middlewares/auth.middlewares.js';
import { getStores, updateStoreStatus } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/stores', auth, allowedRoles('ADMIN'), getStores);
router.put('/store/:storeId/status', auth, allowedRoles('ADMIN'), updateStoreStatus);
// Create a stats route

export default router;
