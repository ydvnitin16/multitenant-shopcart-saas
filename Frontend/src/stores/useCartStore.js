import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],

            // Add with selected quantity
            addToCart: (productId, selectedQty = 1) => {
                const existing = get().cart.find(
                    (item) => item.productId === productId,
                );

                if (existing) {
                    set({
                        cart: get().cart.map((item) =>
                            item.productId === productId
                                ? {
                                      ...item,
                                      quantity: item.quantity + 1,
                                  }
                                : item,
                        ),
                    });
                } else {
                    set({
                        cart: [
                            ...get().cart,
                            { productId, quantity: selectedQty },
                        ],
                    });
                }
            },

            // Increase quantity
            increaseQuantity: (productId) => {
                set({
                    cart: get().cart.map((item) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item,
                    ),
                });
            },

            // Decrease quantity
            decreaseQuantity: (productId) => {
                const existing = get().cart.find(
                    (item) => item.productId === productId,
                );

                if (!existing) return;

                if (existing.quantity === 1) {
                    // remove item if quantity becomes 0
                    set({
                        cart: get().cart.filter(
                            (item) => item.productId !== productId,
                        ),
                    });
                } else {
                    set({
                        cart: get().cart.map((item) =>
                            item.productId === productId
                                ? { ...item, quantity: item.quantity - 1 }
                                : item,
                        ),
                    });
                }
            },

            // Remove completely
            removeFromCart: (productId) => {
                set({
                    cart: get().cart.filter(
                        (item) => item.productId !== productId,
                    ),
                });
            },

            // Clear cart
            clearCart: () => set({ cart: [] }),
        }),
        { name: "shopcart-cart-storage" },
    ),
);

export default useCartStore;
