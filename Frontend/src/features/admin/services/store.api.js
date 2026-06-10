import { fetchService } from "@/services/fetchService";

export const updateStoreStatus = async (storeId, status) => {
    return fetchService({
        endpoint: `/admin/stores/${storeId}/status`,
        method: "PATCH",
        body: { status },
    });
};

export const updateStoreActivation = async (storeId, isActive) => {
    return fetchService({
        endpoint: `/admin/stores/${storeId}/activation`,
        method: "PATCH",
        body: { isActive },
    });
};
