import { fetchService } from "@/services/fetchService";

export const cancelStoreOrder = async (storeOrderId) => {
    return fetchService({
        endpoint: `/orders/${storeOrderId}/cancel`,
        method: "PATCH",
    });
};
