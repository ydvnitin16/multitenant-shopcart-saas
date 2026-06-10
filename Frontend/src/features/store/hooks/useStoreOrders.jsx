import useFetch from "@/hooks/useFetch";
import { useCallback, useEffect, useMemo, useState } from "react";
import { updateStoreOrderStatus as updateStoreOrderStatusApi } from "../services/order.api";
import toast from "react-hot-toast";

export const useStoreOrders = ({ storeId, page, limit }) => {
    const endpoint = useMemo(() => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        });

        return `/stores/${storeId}/orders?${params.toString()}`;
    }, [limit, page, storeId]);

    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState(null);
    const [loadingIds, setLoadingIds] = useState(() => new Set());

    const { data, loading, error, reFetch } = useFetch(
        storeId ? endpoint : null,
        {},
        { enabled: Boolean(storeId) },
    );

    useEffect(() => {
        if (data?.orders) {
            
    console.log(data);
            setOrders(data.orders || []);
            setStats(data.stats || null);
        }
    }, [data]);

    const updateOrderStatus = useCallback(
        async (orderId, newStatus) => {
            // Optimistic update
            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId
                        ? {
                              ...order,
                              status: newStatus,
                              isPaid:
                                  newStatus === "DELIVERED"
                                      ? true
                                      : newStatus === "CANCELLED"
                                        ? false
                                        : order.isPaid,
                          }
                        : order,
                ),
            );
            setLoadingIds((prev) => new Set(prev).add(orderId));

            try {
                const response = await updateStoreOrderStatusApi(
                    orderId,
                    newStatus,
                );
                const updatedStoreOrder = response?.storeOrder;

                if (updatedStoreOrder) {
                    setOrders((prev) =>
                        prev.map((order) =>
                            order._id === orderId
                                ? {
                                      ...order,
                                      status: updatedStoreOrder.status,
                                      isPaid: updatedStoreOrder.isPaid,
                                  }
                                : order,
                        ),
                    );
                }
            } catch (err) {
                toast.error(err.message || "Something went wrong");
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
        stats,
        loading,
        error: error?.message || null,
        refetch: reFetch,
        pagination: data?.pagination,
        updateOrderStatus,
        isUpdating: (orderId) => loadingIds.has(orderId),
    };
};
