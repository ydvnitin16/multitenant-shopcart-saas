import { fetchService } from "@/services/fetchService";

export const loginUser = async (data) => {
    return fetchService({
        endpoint: "api/auth/login",
        method: "POST",
        body: data,
    });
};

export const signupUser = async (data) => {
    return fetchService({
        endpoint: "api/auth/register",
        method: "POST",
        body: data,
    });
};

export const logoutUser = async () => {
    return fetchService({
        endpoint: "api/auth/logout",
        method: "DELETE",
    });
};
