import { fetchService } from "@/services/fetchService";

export const loginUser = async (data) => {
    return fetchService({
        endpoint: "auth/login",
        method: "POST",
        body: data,
    });
};

export const signupUser = async (data) => {
    return fetchService({
        endpoint: "auth/register",
        method: "POST",
        body: data,
    });
};

export const logoutUser = async () => {
    return fetchService({
        endpoint: "auth/logout",
        method: "DELETE",
    });
};
