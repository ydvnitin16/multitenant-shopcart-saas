import { useEffect, useState } from "react";
import useCartStore from "../../../stores/useCartStore";
import { getProductsByIds } from "../../catalog/services/products";

export const useCartItems = () => {
    const cart = useCartStore((state) => state.cart);

    const productIds = cart
        .map((item) => item.productId)
        .sort()
        .join(",");

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (cart.length === 0) {
                setCartItems([]);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const ids = cart.map((item) => item.productId);

                const data = await getProductsByIds(ids);

                setCartItems(data.products);
            } catch (err) {
                setError(err.message || "Failed to fetch cart products");
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [productIds]);

    const mergedProducts = cartItems.map((product) => {
        const cartItem = cart.find((item) => item.productId === product._id);

        return {
            ...product,
            quantity: cartItem?.quantity || 1,
        };
    });

    return { cartItems: mergedProducts, loading, error };
};
