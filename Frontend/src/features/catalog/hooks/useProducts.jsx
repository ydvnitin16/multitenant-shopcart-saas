import { useEffect, useState } from "react";
import { getProducts } from "../services/products";

export const useProducts = ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    storeId,
}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProducts({
                    page,
                    limit,
                    sortBy,
                    order,
                    storeId,
                });
                
                setProducts(data.products);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    return { products, loading, error };
};
