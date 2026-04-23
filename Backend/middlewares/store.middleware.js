import { getStoreService } from '../services/store.service.js';
import ApiError from '../utils/apiError.js';

export const resolveTenant = async (req, res, next) => {
    const { storeSlug } = req.params;
    const store = await getStoreService({ slug: storeSlug });
    if (!store) throw new ApiError(404, 'Store not found');

    if (store.user.toString() !== req.user.id.toString()) {
        throw new ApiError(403, 'This store does not belongs to you');
    }

    req.store = store;
    next();
};

export const isStoreApproved = async (req, res, next) => {
    const store = req.store;

    if (store.status !== 'APPROVED') {
        throw new ApiError(403, 'Store is not approved');
    }

    next();
};
