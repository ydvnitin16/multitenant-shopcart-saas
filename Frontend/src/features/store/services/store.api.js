import { fetchService } from "@/services/fetchService";

export const requestStore = async (data) => {
    return fetchService({
        endpoint: "/stores/request",
        method: "POST",
        body: data,
    });
};
