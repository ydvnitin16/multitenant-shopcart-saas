import {
    createStoreService,
    getStoreOrdersService,
    getStoreService,
    getStoresService,
} from "../services/store.service.js";
import ApiSuccess from "../utils/apiSuccess.js";

export const createStoreRequest = async (req, res) => {
    const user = req.user.id;
    req.body.image = req.file;
    const store = await createStoreService({ ...req.body, user });

    ApiSuccess(res, 201, "Store Request created", { store });
};

export const getUserStores = async (req, res) => {
    const user = req.user.id;
    const { ...filters } = req.query;

    const query = {
        user,
        ...filters,
    };

    const stores = await getStoresService(query);
    ApiSuccess(res, 201, "Store retrieved successfully", { stores });
};

export const getStoreFront = async (req, res) => {
    const { slug } = req.params;
    const store = await getStoreService({ slug });
    res.status(200).json({
        success: true,
        store,
    });
};

export const getStoreOrders = async (req, res) => {
    const { storeId } = req.params;

    const orders = await getStoreOrdersService(storeId);

    res.status(200).json({
        success: true,
        orders,
    });
};
