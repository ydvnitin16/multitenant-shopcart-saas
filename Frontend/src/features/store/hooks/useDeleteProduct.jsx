import useFetch from "@/hooks/useFetch";

const useDeleteProduct = ({ storeSlug, setProducts }) => {
    const {
        loading,
        error,
        execute: executeDelete,
    } = useFetch(null, {}, { enabled: false });

    const deleteProduct = async (productId) => {
        const data = await executeDelete({
            endpoint: `${storeSlug}/${productId}`,
            enabled: true,
            method: "DELETE",
        });

        setProducts((prev) => prev.filter((item) => item._id !== productId));

        return data;
    };

    return {
        deleteProduct,
        loading,
        error: error?.message || null,
    };
};

export default useDeleteProduct;
