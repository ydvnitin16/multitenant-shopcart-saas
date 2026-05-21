import { useCallback, useEffect, useMemo, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
    updateStoreActivation,
    updateStoreStatus,
} from "../services/store.api";

const useStores = ({ status, page = 1, limit = 10 }) => {
    const endpoint = useMemo(() => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        if (status && status !== "ALL") {
            params.set("status", status);
        }

        return `/api/admin/stores?${params.toString()}`;
    }, [limit, page, status]);

    const { data, loading, error, reFetch } = useFetch(endpoint);
    const [stores, setStores] = useState([]);
    const [loadingIds, setLoadingIds] = useState(() => new Set());

    useEffect(() => {
        if (data?.stores) setStores(data.stores);
    }, [data]);

    const syncStore = useCallback((updatedStore) => {
        setStores((prev) =>
            prev
                .map((store) =>
                    store._id === updatedStore._id ? updatedStore : store,
                )
                .filter((store) => status === "ALL" || store.status === status),
        );
    }, [status]);

    const withLoading = useCallback(async (storeId, action) => {
        setLoadingIds((prev) => new Set(prev).add(storeId));

        try {
            return await action();
        } finally {
            setLoadingIds((prev) => {
                const ids = new Set(prev);
                ids.delete(storeId);
                return ids;
            });
        }
    }, []);

    const updateStatusAction = useCallback(
        async (storeId, newStatus) => {
            const previousStores = stores;

            setStores((prev) =>
                prev
                    .map((store) =>
                        store._id === storeId
                            ? {
                                  ...store,
                                  status: newStatus,
                                  isActive: newStatus === "APPROVED",
                              }
                            : store,
                    )
                    .filter((store) =>
                        status === "ALL" ? true : store.status === status,
                    ),
            );

            try {
                const response = await withLoading(storeId, () =>
                    updateStoreStatus(storeId, newStatus),
                );
                syncStore(response.store);
                await reFetch();
            } catch (err) {
                setStores(previousStores);
                console.error(err.message);
            }
        },
        [reFetch, status, stores, syncStore, withLoading],
    );

    const toggleStoreActivation = useCallback(
        async (storeId, isActive) => {
            const previousStores = stores;

            setStores((prev) =>
                prev.map((store) =>
                    store._id === storeId ? { ...store, isActive } : store,
                ),
            );

            try {
                const response = await withLoading(storeId, () =>
                    updateStoreActivation(storeId, isActive),
                );
                syncStore(response.store);
            } catch (err) {
                setStores(previousStores);
                console.error(err.message);
            }
        },
        [stores, syncStore, withLoading],
    );

    return {
        stores,
        pagination: data?.pagination || {
            total: 0,
            page,
            limit,
            pages: 1,
        },
        loading,
        error: error?.message || null,
        approveStore: (id) => updateStatusAction(id, "APPROVED"),
        rejectStore: (id) => updateStatusAction(id, "REJECTED"),
        toggleStoreActivation,
        isLoading: (id) => loadingIds.has(id),
        setStores,
        reFetch,
    };
};

export default useStores;
