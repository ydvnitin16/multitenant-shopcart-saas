import { fetchService } from "@/services/fetchService";

export const getAddresses = async () => {
    return fetchService({
        endpoint: "/api/addresses",
        method: "GET",
    });
};

export const addAddress = async (data) => {
    return fetchService({
        endpoint: "/api/addresses",
        method: "POST",
        body: data,
    });
};
