import useFetch from "@/hooks/useFetch";

const useUpdateProduct = ({ storeSlug, setProducts }) => {
    const {
        loading,
        error,
        execute: executeUpdate,
    } = useFetch(null, {}, { enabled: false });

    const updateProduct = async (productId, payload) => {
        const normalizedPayload = {
            ...payload,
            mrp: Number(payload.mrp),
            price: Number(payload.price),
            stock: Number(payload.stock),
        };

        const data = await executeUpdate({
            endpoint: `${storeSlug}/${productId}/update`,
            enabled: true,
            method: "PUT",
            body: normalizedPayload,
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
    };

    return {
        updateProduct,
        loading,
        error: error?.message || null,
    };
};

export default useUpdateProduct;
