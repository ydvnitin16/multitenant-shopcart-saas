import useFetch from "@/hooks/useFetch";
import { useCallback, useMemo, useState } from "react";

const useStoreProducts = ({ storeId }) => {
    const [localProducts, setLocalProducts] = useState(null);
    const { data, loading, error, reFetch } = useFetch(
        storeId ? `/stores/${storeId}/products` : null,
    );

    const total = useMemo(() => data?.total || 0, [data?.total]);
    const products = localProducts || data?.products || [];

    const setProducts = useCallback(
        (nextProducts) => {
            setLocalProducts((prevProducts) => {
                const currentProducts = prevProducts || data?.products || [];
                return typeof nextProducts === "function"
                    ? nextProducts(currentProducts)
                    : nextProducts;
            });
        },
        [data?.products],
    );

    const refetch = useCallback(async () => {
        const result = await reFetch();
        setLocalProducts(result?.products || []);
        return result;
    }, [reFetch]);

    return {
        loading,
        error: error?.message || null,
        products,
        setProducts,
        total,
        refetch,
    };
};

export default useStoreProducts;
