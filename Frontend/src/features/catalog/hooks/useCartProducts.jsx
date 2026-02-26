import { useEffect, useState } from "react";
import useCartStore from "../stores/useCartStore";
import { getProductsByIds } from "../services/products";

export const useCartProducts = () => {
    const cart = useCartStore((state) => state.cart);

    const productIds = cart
        .map((item) => item.productId)
        .sort()
        .join(",");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartProducts = async () => {
            if (cart.length === 0) {
                setProducts([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const ids = cart.map((item) => item.productId);

                const data = await getProductsByIds(ids);

                setProducts(data.products);
            } catch (err) {
                setError(err.message || "Failed to fetch cart products");
            } finally {
                setLoading(false);
            }
        };

        fetchCartProducts();
    }, [productIds]);

    const mergedProducts = products.map((product) => {
        const cartItem = cart.find((item) => item.productId === product._id);

        return {
            ...product,
            quantity: cartItem?.quantity || 1,
        };
    });

    return { products: mergedProducts, loading, error };
};
