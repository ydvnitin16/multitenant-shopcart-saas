import { fetchService } from "@/services/fetchService";

export const cancelStoreOrder = async (storeOrderId) => {
    return fetchService({
        endpoint: `orders/store-order/${storeOrderId}/cancel`,
        method: "PATCH",
    });
};
