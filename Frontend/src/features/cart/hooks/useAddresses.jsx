import useFetch from "@/hooks/useFetch";

export const useAddresses = () => {
    const { data, loading, error, reFetch } = useFetch("addresses");

    return {
        addresses: data?.addresses || [],
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};
