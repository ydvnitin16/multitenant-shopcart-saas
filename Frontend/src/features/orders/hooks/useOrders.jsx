import useFetch from "@/hooks/useFetch";

export const useOrders = () => {
    const { data, loading, error, reFetch } = useFetch("orders/my-orders");

    return {
        orders: data?.orders || [],
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};
