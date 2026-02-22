import { updateUserRole } from '../services/auth.service.js';
import {
    getStoresService,
    updateStoreStatusService,
} from '../services/store.service.js';
import ApiSuccess from '../utils/apiSuccess.js';

export const updateStoreStatus = async (req, res) => {
    const { storeId } = req.params;
    const { status } = req.body;
    const store = await updateStoreStatusService({ storeId, status });

    if (store.status === 'APPROVED')
        updateUserRole({ userId: store.userId, role: 'VENDOR' });

    ApiSuccess(res, 200, `Store ${status}`, store);
};

export const getStores = async (req, res) => {
    let { status } = req.query; // Add query logic to fetch desired Stores
    const stores = await getStoresService({ status });
    console.log(stores)
    ApiSuccess(res, 200, 'Stores retrieved successfully', { stores });
};
