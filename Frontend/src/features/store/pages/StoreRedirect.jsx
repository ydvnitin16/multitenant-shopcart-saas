import useVendorStoreStore from "@/stores/useVendorStoreStore";
import InlineLoader from "@/components/ui/InlineLoader";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const StoreRedirect = () => {
    const navigate = useNavigate();
    const { setStores, setCurrentStore } = useVendorStoreStore();
    const { data, loading, error } = useFetch("stores/me");

    useEffect(() => {
        const firstStore = data?.stores?.[0];
        if (!firstStore) {
            return;
        }

        setStores(data.stores);
        setCurrentStore(firstStore.slug);
        navigate(`/store/${firstStore.slug}/dashboard`, {
            replace: true,
        });
    }, [data?.stores, navigate, setCurrentStore, setStores]);

    if (loading) {
        return (
            <div className='flex min-h-[40vh] items-center justify-center'>
                <InlineLoader content='Loading your stores...' />
            </div>
        );
    }

    if (error) {
        return (
            <div className='p-6 text-sm text-red-600'>
                {error.message || "Failed to fetch stores."}
            </div>
        );
    }

    return null;
};

export default StoreRedirect;
