import useFetch from "@/hooks/useFetch";
import { useMemo } from "react";

export const useProducts = ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    storeId,
    store,
    category,
}) => {
    const params = useMemo(() => {
        const searchParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sortBy,
            order,
        });

        if (store || storeId) {
            searchParams.set("store", store || storeId);
        }

        if (category) {
            searchParams.set("category", category);
        }

        return searchParams.toString();
    }, [category, limit, order, page, sortBy, store, storeId]);

    const { data, loading, error, reFetch } = useFetch(`/api/products?${params}`);

    return {
        products: data?.products || [],
        categories: data?.categories || [],
        loading,
        error: error?.message || null,
        pagination: data?.pagination || {
            page: 1,
            pages: 1,
            total: 0,
        },
        refetch: reFetch,
    };
};
