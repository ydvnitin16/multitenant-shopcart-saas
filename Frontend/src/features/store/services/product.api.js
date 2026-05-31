import { fetchService } from "@/services/fetchService";

export const addProduct = async (storeId, data) => {
    return fetchService({
        endpoint: `/api/stores/${storeId}/products`,
        method: "POST",
        body: data,
    });
};

export const fetchProducts = async ({ storeId }) => {
    return fetchService({
        endpoint: `/api/stores/${storeId}/products`,
        method: "GET",
    });
};

export const updateProductStock = async ({ storeId, productId, inStock }) => {
    return fetchService({
        endpoint: `/api/stores/${storeId}/products/${productId}/update`,
        method: "PUT",
        body: { stock: inStock ? 0 : 1 },
    });
};
