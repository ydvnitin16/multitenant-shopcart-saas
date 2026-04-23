const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const fetchService = async ({
    endpoint,
    method = "GET",
    headers = {},
    body,
    signal,
}) => {
    const normalizedEndpoint = endpoint?.replace(/^\/+/, "") || "";
    const normalizedBaseUrl = BASE_URL?.replace(/\/+$/, "") || "";
    const url = `${normalizedBaseUrl}/${normalizedEndpoint}`;

    // Only set default Content-Type for non-FormData bodies
    const defaultHeaders =
        body instanceof FormData ? {} : { "Content-Type": "application/json" };

    let config = {
        method,
        headers: { ...defaultHeaders, ...headers },
        signal,
        credentials: "include",
        ...(body
            ? { body: body instanceof FormData ? body : JSON.stringify(body) }
            : {}),
    };

    const res = await fetch(url, config);
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
        ? await res.json()
        : null;

    if (!res.ok) {
        const error = new Error(
            data?.message || data?.error || "Request failed",
        );
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
};
