import useFetch from "@/hooks/useFetch";

const useStoreDashboard = (storeSlug) => {
    const { data, loading, error, reFetch } = useFetch(
        storeSlug ? `/api/stores/${storeSlug}/stats` : null,
        {},
        { enabled: Boolean(storeSlug) },
    );

    return {
        dashboard: data || null,
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};

export default useStoreDashboard;
