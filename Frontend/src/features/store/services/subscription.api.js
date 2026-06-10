import { fetchService } from "@/services/fetchService";

export const subscriptionBillingCheckout = async (storeId, plan) => {
    return fetchService({
        endpoint: "/subscriptions/checkout",
        method: "POST",
        body: { storeId, plan },
    });
};

export const fetchStoreSubscription = async (storeId) => {
    return fetchService({
        endpoint: `/subscriptions/stores/${storeId}`,
        method: "GET",
    });
};

export const cancelSubscription = async (storeId) => {
    return fetchService({
        endpoint: `/subscriptions/stores/${storeId}/cancel`,
        method: "PATCH",
    });
};

export const upgradeCurrentSubscription = async (storeId, plan) => {
    return fetchService({
        endpoint: `/subscriptions/stores/${storeId}/upgrade`,
        method: "PATCH",
        body: { plan },
    });
};
