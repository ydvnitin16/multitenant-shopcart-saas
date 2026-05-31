import Subscription from "../models/subscription.js";
import {
    getAdminStatsService,
    getAdminStoresService,
} from "../services/admin.service.js";
import { updateUserRole } from "../services/auth.service.js";
import {
    updateStoreActivationService,
    updateStoreStatusService,
} from "../services/store.service.js";
import ApiSuccess from "../utils/apiSuccess.js";

export const updateStoreStatus = async (req, res) => {
    const { storeId } = req.params;
    const { status } = req.body;
    const store = await updateStoreStatusService({ storeId, status });

    if (store.status === "APPROVED") {
        await Subscription.create({ store: store._id });
        await updateUserRole({ userId: store.user, role: "VENDOR" });
    }

    ApiSuccess(res, 200, `Store ${status}`, { store });
};

export const getStores = async (req, res) => {
    const { status, page, limit } = req.query;
    const stores = await getAdminStoresService({ status, page, limit });

    ApiSuccess(res, 200, "Stores retrieved successfully", stores);
};

export const updateStoreActivation = async (req, res) => {
    const { storeId } = req.params;
    const { isActive } = req.body;

    const store = await updateStoreActivationService({ storeId, isActive });

    ApiSuccess(
        res,
        200,
        `Store ${isActive ? "activated" : "deactivated"} successfully`,
        { store },
    );
};

export const getAdminStats = async (req, res) => {
    const stats = await getAdminStatsService();
    ApiSuccess(res, 200, "Admin stats retrieved successfully", { stats });
};
