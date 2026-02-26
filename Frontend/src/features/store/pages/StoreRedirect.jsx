import useVendorStoreStore from "@/stores/useVendorStoreStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyStores } from "../services/store.api";

const StoreRedirect = () => {
    const navigate = useNavigate();
    const { setStores, setCurrentStore } = useVendorStoreStore();

    useEffect(() => {
        const loadStores = async () => {
            try {
                const data = await fetchMyStores();
                
                const firstStore = data.stores?.[0];
                if (!firstStore) return;

                setStores(data.stores);
                setCurrentStore(firstStore.slug);

                navigate(`/store/${firstStore.slug}/dashboard`, {
                    replace: true,
                });
            } catch (err) {
                console.error("Error fetching user stores:", err.message);
            }
        };

        loadStores();
    }, [navigate, setStores, setCurrentStore]);

    return null;
};

export default StoreRedirect;
