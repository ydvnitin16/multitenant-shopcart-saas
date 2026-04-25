import useFetch from "@/hooks/useFetch";
import { useCallback, useEffect, useState } from "react";
import { updateStoreOrderStatus as updateStoreOrderStatusApi } from "../services/order.api";

export const useStoreOrders = (storeId) => {
    const [orders, setOrders] = useState([]);
    const [loadingIds, setLoadingIds] = useState(() => new Set());

    const { data, loading, error, reFetch } = useFetch(
        storeId ? `store-orders/${storeId}` : null,
        {},
        { enabled: Boolean(storeId) },
    );

    useEffect(() => {
        if (data?.orders) setOrders(data.orders || []);
    }, [data]);

    const updateOrderStatus = useCallback(
        async (orderId, newStatus) => {
            // Optimistic update
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId
                        ? { ...order, status: newStatus }
                        : order,
                ),
            );
            setLoadingIds((prev) => new Set(prev).add(orderId));

            try {
                await updateStoreOrderStatusApi(orderId, newStatus);
            } catch (err) {
                // Rollback if backend update request fails
                setOrders(data?.orders ?? []);
                console.error(err.message);
            } finally {
                setLoadingIds((prev) => {
                    const ids = new Set(prev);
                    ids.delete(orderId);
                    return ids;
                });
            }
        },
        [data],
    );

    return {
        orders,
        loading,
        error: error?.message || null,
        refetch: reFetch,
        updateOrderStatus,
        isUpdating: (orderId) => loadingIds.has(orderId),
    };
};
