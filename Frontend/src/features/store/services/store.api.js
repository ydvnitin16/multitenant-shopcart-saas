import { fetchService } from "@/services/fetchService";

export const fetchMyStores = async () => {
    return fetchService({
        endpoint: "/stores",
        method: "GET",
    });
};

export const requestStore = async (data) => {
    return fetchService({
        endpoint: "/stores/request",
        method: "POST",
        body: data,
    });
};

export const fetchStoreOrders = async (storeId) => {
    return fetchService({
        endpoint: `/stores/orders/${storeId}`,
        method: "GET",
    });
};

export const fetchStoreDashboard = async (storeSlug) => {
    return fetchService({
        endpoint: `/stores/${storeSlug}/stats`,
        method: "GET",
    });
};

export const fetchPublicStore = async (slug) => {
    return fetchService({
        endpoint: `/stores/${slug}`,
        method: "GET",
    });
};
