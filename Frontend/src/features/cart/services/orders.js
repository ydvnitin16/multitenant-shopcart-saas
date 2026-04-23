import { fetchService } from "@/services/fetchService";

export const placeOrder = async (data) => {
    return fetchService({
        endpoint: "orders/place-order",
        method: "POST",
        body: data,
    });
};

export const getOrders = async () => {
    return fetchService({
        endpoint: "orders/my-orders",
        method: "GET",
    });
};
