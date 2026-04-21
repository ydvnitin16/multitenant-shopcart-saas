const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const fetchMyStores = async () => {
    const res = await fetch(`${BASE_URL}/store/user-stores`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch my stores`);
    }
    return await res.json();
};

export const requestStore = async (data) => {
    const res = await fetch(`${BASE_URL}/store/create-request`, {
        method: "POST",
        credentials: "include",
        body: data,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Store request failed");
    }
    return await res.json();
};

export const fetchStoreOrders = async (storeId) => {
    const res = await fetch(`${BASE_URL}/store/orders/${storeId}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch store orders`);
    }
    return await res.json();
};
