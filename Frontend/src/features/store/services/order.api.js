import { fetchService } from "@/services/fetchService";

export const updateStoreOrderStatus = async (orderId, status) => {
    return fetchService({
        endpoint: `store-orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
    });
};
