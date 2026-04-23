import useFetch from "@/hooks/useFetch";
import { useMemo } from "react";

export const useProducts = ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    storeId,
    store,
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

        return searchParams.toString();
    }, [limit, order, page, sortBy, store, storeId]);

    const { data, loading, error, reFetch } = useFetch(`products?${params}`);

    return {
        products: data?.products || [],
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
