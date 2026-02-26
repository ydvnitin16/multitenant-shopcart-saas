const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const getProducts = async ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    storeId,
}) => {
    const res = await fetch(
        `${BASE_URL}/products?sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch products`);
    }
    return await res.json();
};

export const getProductById = async (id) => {
    const res = await fetch(`${BASE_URL}/product/${id}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch product`);
    }
    return await res.json();
};

export const getProductsByIds = async (productIds) => {
    const ids = productIds.join(",");
    
    const res = await fetch(`${BASE_URL}/products/cart/?ids=${ids}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to fetch cart products`);
    }
    return await res.json();
};
