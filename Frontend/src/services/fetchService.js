const BASE_URL = import.meta.env.VITE_SERVER_URL;
const default_headers = { "Content-Type": "application/json" };

export const fetchService = async ({
    endpoint,
    method = "GET",
    headers,
    body,
    signal,
}) => {
    const url = `${BASE_URL}/${endpoint}`;
    let config = {
        method,
        headers: { ...default_headers, headers },
        signal,
        credentials: true,
        ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
        const error = new Error(data.message);
        error.status = res.status;
        throw error;
    }
    console.log(data);

    return data;
};
