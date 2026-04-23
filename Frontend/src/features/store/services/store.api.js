import { fetchService } from "@/services/fetchService";

export const fetchMyStores = async () => {
    return fetchService({
        endpoint: "stores/me",
        method: "GET",
    });
};

export const requestStore = async (data) => {
    return fetchService({
        endpoint: "stores/create-request",
        method: "POST",
        body: data,
    });
};

export const fetchStoreOrders = async (storeId) => {
    return fetchService({
        endpoint: `stores/orders/${storeId}`,
        method: "GET",
    });
};

export const fetchPublicStore = async (slug) => {
    return fetchService({
        endpoint: `stores/${slug}/public`,
        method: "GET",
    });
};
