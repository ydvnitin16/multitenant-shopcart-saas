import useFetch from "@/hooks/useFetch";

const useAdminStats = () => {
    const { data, loading, error, reFetch } = useFetch("/admin/stats");

    return { stats: data?.stats, loading, error, reFetch };
};
export default useAdminStats;
