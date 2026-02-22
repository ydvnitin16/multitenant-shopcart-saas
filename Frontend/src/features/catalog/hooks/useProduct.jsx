import { useEffect, useState } from "react";
import { getProductById } from "../services/products";

export const useProduct = ({ productId }) => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProductById(productId);
                console.log(data);
                setProduct(data.product);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };
        if (productId) {
            loadProducts();
        }
    }, [productId]);

    return { product, loading, error };
};
