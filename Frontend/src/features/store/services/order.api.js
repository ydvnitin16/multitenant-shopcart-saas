import { fetchService } from "@/services/fetchService";

export const updateStoreOrderStatus = async (orderId, status) => {
    return fetchService({
        endpoint: `/stores/orders/${orderId}/status`,
        method: "PATCH",
        body: { status },
    });
};
