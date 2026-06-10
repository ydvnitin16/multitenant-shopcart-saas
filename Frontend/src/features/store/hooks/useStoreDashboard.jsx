import useFetch from "@/hooks/useFetch";

const useStoreDashboard = (storeId) => {
    const { data, loading, error, reFetch } = useFetch(
        storeId ? `/stores/${storeId}/stats` : null,
        {},
        { enabled: Boolean(storeId) },
    );

    return {
        dashboard: data || null,
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};

export default useStoreDashboard;
