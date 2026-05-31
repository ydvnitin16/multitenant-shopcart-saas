import { fetchService } from "@/services/fetchService";

export const getProducts = async ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    storeId,
    store,
    category,
}) => {
    const params = new URLSearchParams({
        sortBy,
        order,
        page: String(page),
        limit: String(limit),
    });

    if (store || storeId) {
        params.set("store", store || storeId);
    }

    if (category) {
        params.set("category", category);
    }

    return fetchService({
        endpoint: `products?${params.toString()}`,
        method: "GET",
    });
};

export const getProductById = async (id) => {
    return fetchService({
        endpoint: `product/${id}`,
        method: "GET",
    });
};

export const getProductsByIds = async (productIds) => {
    const ids = productIds.join(",");
    return fetchService({
        endpoint: `api/products/cart?ids=${ids}`,
        method: "GET",
    });
};
