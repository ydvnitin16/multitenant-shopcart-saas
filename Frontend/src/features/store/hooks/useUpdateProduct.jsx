import { useState } from "react";
import { updateStoreProduct } from "../services/product.api";

const useUpdateProduct = ({ storeId, setProducts }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProduct = async (productId, payload) => {
        const normalizedPayload = {
            ...payload,
            mrp: Number(payload.mrp),
            price: Number(payload.price),
            stock: Number(payload.stock),
        };

        try {
            setLoading(true);
            setError(null);

            const data = await updateStoreProduct({
                storeId,
                productId,
                data: normalizedPayload,
            });

            if (data?.product) {
                setProducts((prev) =>
                    prev.map((item) =>
                        item._id === productId
                            ? {
                                  ...item,
                                  ...data.product,
                              }
                            : item,
                    ),
                );
            }

            return data;
        } catch (err) {
            setError(err.message || "Something went wrong");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateProduct,
        loading,
        error,
    };
};

export default useUpdateProduct;
