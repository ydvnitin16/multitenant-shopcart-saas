const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const getAddresses = async () => {
    const res = await fetch(`${BASE_URL}/address`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch address`);
    }
    return await res.json();
};

export const addAddress = async (data) => {
    console.log(data);
    const res = await fetch(`${BASE_URL}/address/add`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to add address`);
    }
    return await res.json();
};
