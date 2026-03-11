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
    const [pagination, setPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
    });

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
                console.log(data);

                setProducts(data.products);
                setPagination(data.pagination);
            } catch (err) {
                setError(err.message || "Something went wrong!");
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [page, limit, sortBy, order, storeId]);

    return { products, loading, error, pagination };
};
