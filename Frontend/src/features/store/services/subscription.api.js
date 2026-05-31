import { fetchService } from "@/services/fetchService";

export const subscriptionBillingCheckout = async (storeId, plan) => {
    return fetchService({
        endpoint: "/api/subscriptions/checkout",
        method: "POST",
        body: { storeId, plan },
    });
};

export const fetchStoreSubscription = async (storeId) => {
    return fetchService({
        endpoint: `/api/subscriptions/stores/${storeId}/current`,
        method: "GET",
    });
};
