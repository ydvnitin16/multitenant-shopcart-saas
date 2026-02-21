import {
    createStoreService,
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
    console.log(userId);
    const stores = await getStoresService({ userId: userId });
    ApiSuccess(res, 201, "Store retrieved successfully", { stores });
};
