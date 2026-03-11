const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const placeOrder = async (data) => {
    console.log(data);
    const res = await fetch(`${BASE_URL}/orders/place-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to place order`);
    }
    return await res.json();
};

export const getOrders = async () => {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch orders`);
    }
    return await res.json();
};
