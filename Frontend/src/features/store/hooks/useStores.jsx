import { useEffect, useState } from "react";
import { fetchMyStores } from "../services/store.api";

export const useStores = ({ status = "ALL" }) => {
    const [stores, setStores] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await fetchMyStores();
                let stores = data?.stores || [];

                stores =
                    status === "ALL" || !stores.length > 0
                        ? stores
                        : stores.filter((s) => s.status === status);

                setStores(stores);
            } catch (err) {
                setError("Failed to fetch request.");
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    return { stores, loading, error };
};
