import useFetch from "@/hooks/useFetch";
import { useCallback, useEffect, useState } from "react";
import { cancelStoreOrder as cancelStoreOrderApi } from "../services/order.api";

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loadingIds, setLoadingIds] = useState(() => new Set());
    const { data, loading, error, reFetch } = useFetch("orders/my-orders");

    useEffect(() => {
        if (data?.orders) {
            setOrders(data.orders);
        }
    }, [data]);

    const cancelStoreOrder = useCallback(
        async (storeOrderId) => {
            setOrders((prev) =>
                prev.map((order) => ({
                    ...order,
                    storeOrders: order.storeOrders.map((storeOrder) =>
                        storeOrder._id === storeOrderId
                            ? {
                                  ...storeOrder,
                                  status: "CANCELLED",
                                  isPaid: false,
                              }
                            : storeOrder,
                    ),
                })),
            );
            setLoadingIds((prev) => new Set(prev).add(storeOrderId));

            try {
                const response = await cancelStoreOrderApi(storeOrderId);
                const updatedStoreOrder = response?.storeOrder;

                if (updatedStoreOrder) {
                    setOrders((prev) =>
                        prev.map((order) => ({
                            ...order,
                            storeOrders: order.storeOrders.map((storeOrder) =>
                                storeOrder._id === updatedStoreOrder._id
                                    ? {
                                          ...storeOrder,
                                          status: updatedStoreOrder.status,
                                          isPaid: updatedStoreOrder.isPaid,
                                      }
                                    : storeOrder,
                            ),
                        })),
                    );
                }
            } catch (err) {
                setOrders(data?.orders ?? []);
                console.error(err.message);
            } finally {
                setLoadingIds((prev) => {
                    const ids = new Set(prev);
                    ids.delete(storeOrderId);
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
        cancelStoreOrder,
        isCancelling: (storeOrderId) => loadingIds.has(storeOrderId),
    };
};
