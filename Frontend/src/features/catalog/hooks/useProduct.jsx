import useFetch from "@/hooks/useFetch";

export const useProduct = ({ productId }) => {
    const { data, loading, error, reFetch } = useFetch(
        productId ? `product/${productId}` : null,
        {},
        { enabled: Boolean(productId) },
    );

    return {
        product: data?.product || null,
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};
