import { fetchService } from "@/services/fetchService";

export const addProduct = async (storeSlug, data) => {
    return fetchService({
        endpoint: `${storeSlug}/create-product`,
        method: "POST",
        body: data,
    });
};

export const fetchProducts = async ({ storeSlug }) => {
    return fetchService({
        endpoint: `${storeSlug}/products`,
        method: "GET",
    });
};

export const updateProductStock = async ({ storeSlug, productId, inStock }) => {
    return fetchService({
        endpoint: `${storeSlug}/product/${productId}/update`,
        method: "PUT",
        body: { stock: inStock ? 0 : 1 },
    });
};
