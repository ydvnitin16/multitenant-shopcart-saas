import { fetchService } from "@/services/fetchService";

export const getAddresses = async () => {
    return fetchService({
        endpoint: "addresses",
        method: "GET",
    });
};

export const addAddress = async (data) => {
    return fetchService({
        endpoint: "addresses/add",
        method: "POST",
        body: data,
    });
};
