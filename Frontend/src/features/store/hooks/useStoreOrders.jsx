import useFetch from "@/hooks/useFetch";

export const useStoreOrders = (storeId) => {
    const { data, loading, error, reFetch } = useFetch(
        storeId ? `stores/orders/${storeId}` : null,
        {},
        { enabled: Boolean(storeId) },
    );

    return {
        orders: data?.orders || [],
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};
