import { useEffect, useState } from "react";
import { fetchStoreOrders } from "../services/store.api";

export const useStoreOrders = (storeId) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const data = await fetchStoreOrders(storeId);
            setOrders(data.orders);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (storeId) fetchOrders();
    }, [storeId]);

    return { orders, loading, refetch: fetchOrders };
};
