import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { updateStoreStatus } from "../services/store.api";

const useStores = ({ status }) => {
    const query = status && status !== "ALL" ? `?status=${status}` : "";
    const { data, loading, error } = useFetch(`admin/stores${query}`);
    const [stores, setStores] = useState([]);
    const [loadingIds, setLoadingIds] = useState(() => new Set());

    // sync fetched data into local state
    useEffect(() => {
        if (data?.stores) setStores(data.stores);
    }, [data]);

    const updateStatus = useCallback(
        async (storeId, newStatus) => {
            // 1. optimistic update
            setStores((prev) =>
                prev.map((s) =>
                    s._id === storeId ? { ...s, status: newStatus } : s,
                ),
            );
            setLoadingIds((prev) => new Set(prev).add(storeId));

            try {
                await updateStoreStatus(storeId, newStatus);
            } catch (err) {
                // 2. rollback on failure
                setStores(data?.stores ?? []);
                console.error(err.message);
            } finally {
                setLoadingIds((prev) => {
                    const ids = new Set(prev);
                    ids.delete(storeId);
                    return ids;
                });
            }
        },
        [data],
    );

    return {
        stores,
        loading,
        error: error?.message || null,
        approveStore: (id) => updateStatus(id, "APPROVED"),
        rejectStore: (id) => updateStatus(id, "REJECTED"),
        isLoading: (id) => loadingIds.has(id),
        setStores,
    };
};

export default useStores;
