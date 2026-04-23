import useFetch from "@/hooks/useFetch";
import { useMemo } from "react";

export const useStores = ({ status = "ALL" }) => {
    const { data, loading, error, reFetch } = useFetch("stores/me");

    const stores = useMemo(() => {
        const storeList = data?.stores || [];
        if (status === "ALL") {
            return storeList;
        }

        return storeList.filter((store) => store.status === status);
    }, [data?.stores, status]);

    return {
        stores,
        loading,
        error: error?.message || null,
        refetch: reFetch,
    };
};
