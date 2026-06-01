import { fetchService } from "@/services/fetchService";

export const cancelStoreOrder = async (storeOrderId) => {
    return fetchService({
        endpoint: `api/orders/${storeOrderId}/cancel`,
        method: "PATCH",
    });
};
