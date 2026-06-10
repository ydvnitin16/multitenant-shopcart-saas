import { useState } from "react";
import { deleteStoreProduct } from "../services/product.api";

const useDeleteProduct = ({ storeId, setProducts }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProduct = async (productId) => {
        try {
            setLoading(true);
            setError(null);

            const data = await deleteStoreProduct({ storeId, productId });

            setProducts((prev) =>
                prev.filter((item) => item._id !== productId),
            );

            return data;
        } catch (err) {
            setError(err.message || "Something went wrong");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteProduct,
        loading,
        error,
    };
};

export default useDeleteProduct;
