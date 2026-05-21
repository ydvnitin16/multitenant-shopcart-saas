import { fetchService } from "@/services/fetchService";

export const fetchStores = async (params = {}, signal) => {
    const query = new URLSearchParams(params).toString();
    return fetchService({
        endpoint: query ? `admin/stores?${query}` : "admin/stores",
        method: "GET",
        signal,
    });
};

export const updateStoreStatus = async (storeId, status) => {
    return fetchService({
        endpoint: `api/admin/stores/${storeId}/status`,
        method: "PATCH",
        body: { status },
    });
};

export const updateStoreActivation = async (storeId, isActive) => {
    return fetchService({
        endpoint: `api/admin/stores/${storeId}/activation`,
        method: "PATCH",
        body: { isActive },
    });
};
