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
        endpoint: `admin/store/${storeId}/status`,
        method: "PUT",
        body: { status },
    });
};
