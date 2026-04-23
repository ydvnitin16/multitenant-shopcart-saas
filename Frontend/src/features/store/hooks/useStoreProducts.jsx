import useFetch from "@/hooks/useFetch";
import { useEffect, useMemo, useState } from "react";

const useStoreProducts = ({ storeSlug }) => {
    const [products, setProducts] = useState([]);
    const { data, loading, error, reFetch } = useFetch(
        storeSlug ? `${storeSlug}/products` : null,
        {},
        { enabled: Boolean(storeSlug) },
    );

    const total = useMemo(() => data?.total || 0, [data?.total]);

    useEffect(() => {
        if (data?.products) {
            setProducts(data.products);
        }
    }, [data?.products]);

    return {
        loading,
        error: error?.message || null,
        products,
        setProducts,
        total,
        refetch: reFetch,
    };
};

export default useStoreProducts;
