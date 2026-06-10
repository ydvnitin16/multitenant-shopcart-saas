import { fetchService } from "@/services/fetchService";

export const placeOrder = async (data) => {
    return fetchService({
        endpoint: "/orders",
        method: "POST",
        body: data,
    });
};
