import { useCallback } from "react";
import { updateProductStock } from "../services/product.api";
import toast from "react-hot-toast";

const useUpdateStock = ({ setProducts }) => {
    // Hook logic to update stock status

    const updateStock = useCallback(
        async ({ storeSlug, productId, inStock }) => {
            const nextStock = inStock ? 0 : 1;
            try {
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product._id === productId
                            ? { ...product, stock: nextStock }
                            : product,
                    ),
                );
                await updateProductStock({
                    storeSlug,
                    productId,
                    inStock,
                });
                toast.success("Stock updated successfully");
            } catch (err) {
                toast.error(err.message || "Failed to update stock");
                console.error("Error updating stock:", err);
            }
        },
        [setProducts],
    );

    return { updateStock };
};

export default useUpdateStock;
