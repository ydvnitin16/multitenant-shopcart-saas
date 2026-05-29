import {
    createStoreService,
    getStoreFrontService,
    getStoreOrdersService,
    getStoreService,
    getStoresService,
    getStoreStatsService,
} from "../services/store.service.js";
import ApiSuccess from "../utils/apiSuccess.js";

export const createStoreRequest = async (req, res) => {
    const user = req.user.id;
    req.body.image = req.file;
    const store = await createStoreService({ ...req.body, user });

    ApiSuccess(res, 201, "Store Request created", { store });
};

export const getTenantStores = async (req, res) => {
    const user = req.user.id;
    const { ...filters } = req.query;

    const query = {
        user,
        ...filters,
    };

    const stores = await getStoresService(query);
    ApiSuccess(res, 200, "Stores retrieved successfully", { stores });
};

export const getStoreFront = async (req, res) => {
    const { storeSlug } = req.params;
    const store = await getStoreFrontService({ slug: storeSlug });
    ApiSuccess(res, 200, "Store retrieved successfully", { store });
};

export const getStoreStats = async (req, res) => {
    const stats = await getStoreStatsService(req.store);

    ApiSuccess(res, 200, "Store stats retrieved successfully", stats);
};

export const getStoreOrders = async (req, res) => {
    const { storeId } = req.params;
    const { page, limit } = req.query;

    const { stats, orders, total, pagination } = await getStoreOrdersService({
        storeId,
        page,
        limit,
    });

    ApiSuccess(res, 200, "Store orders retrieved successfully", {
        stats,
        orders,
        total,
        pagination,
    });
};
