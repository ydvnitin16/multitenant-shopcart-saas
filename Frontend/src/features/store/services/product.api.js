import { fetchService } from "@/services/fetchService";

export const addProduct = async (storeId, data) => {
    return fetchService({
        endpoint: `/stores/${storeId}/products`,
        method: "POST",
        body: data,
    });
};

export const updateProductStock = async ({ storeId, productId, inStock }) => {
    return fetchService({
        endpoint: `/stores/${storeId}/products/${productId}/update`,
        method: "PUT",
        body: { stock: inStock ? 0 : 1 },
    });
};

export const updateStoreProduct = async ({ storeId, productId, data }) => {
    return fetchService({
        endpoint: `/stores/${storeId}/products/${productId}/update`,
        method: "PUT",
        body: data,
    });
};

export const deleteStoreProduct = async ({ storeId, productId }) => {
    return fetchService({
        endpoint: `/stores/${storeId}/products/${productId}`,
        method: "DELETE",
    });
};
