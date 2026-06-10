import { fetchService } from "@/services/fetchService";

export const addAddress = async (data) => {
    return fetchService({
        endpoint: "/addresses",
        method: "POST",
        body: data,
    });
};
