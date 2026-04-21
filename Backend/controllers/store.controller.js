import {
    createStoreService,
    getStoreOrdersService,
    getStoresService,
} from "../services/store.service.js";
import ApiSuccess from "../utils/apiSuccess.js";

export const createStoreRequest = async (req, res) => {
    const userId = req.user.id;
    req.body.image = req.file;
    const store = await createStoreService({ ...req.body, userId });

    ApiSuccess(res, 201, "Store Request created", { store });
};

export const getUserStores = async (req, res) => {
    const userId = req.user.id;

    const stores = await getStoresService({ userId: userId });
    ApiSuccess(res, 201, "Store retrieved successfully", { stores });
};

export const getStoreOrders = async (req, res) => {
    const { storeId } = req.params;

    const orders = await getStoreOrdersService(storeId);

    res.status(200).json({
        success: true,
        orders,
    });
};
