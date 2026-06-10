import React, { useMemo } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "@/components/ui/Pagination";
import InlineLoader from "@/components/ui/InlineLoader";
import { PRODUCT_CATEGORIES } from "../data/categoriesData";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const params = useMemo(() => {
        const params = new URLSearchParams({
            page: String(page),
            limit: "10",
            sortBy,
            order,
        });

        if (category) {
            params.set("category", category);
        }

        return params.toString();
    }, [page, category, sortBy, order]);

    const { data, loading } = useFetch(`/products?${params}`);

    const products = data?.products || [];

    const pagination = data?.pagination || {
        page: 1,
        pages: 1,
        total: 0,
    };

    const updateSearchParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);

        Object.entries(updates).forEach(([key, value]) => {
            if (value === "" || value == null) {
                newParams.delete(key);
            } else {
                newParams.set(key, String(value));
            }
        });

        setSearchParams(newParams);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 mt-10">
            <div className="flex gap-8">
                {/* Sidebar */}
                <aside className="w-64 hidden lg:block">
                    <div className="sticky top-24 space-y-10">
                        {/* Category */}
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-4 tracking-tight">
                                Category
                            </h3>

                            <select
                                value={category}
                                className="w-full bg-zinc-50 text-sm text-zinc-700 rounded-lg px-3 py-2 outline-none transition focus:bg-white focus:ring-1 focus:ring-zinc-300"
                                onChange={(e) =>
                                    updateSearchParams({
                                        category: e.target.value,
                                        page: 1,
                                    })
                                }
                            >
                                <option value="">All</option>

                                {PRODUCT_CATEGORIES.map((item) => (
                                    <option
                                        key={item}
                                        value={item.toLowerCase()}
                                    >
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-900 mb-4 tracking-tight">
                                Sort By
                            </h3>

                            <select
                                value={
                                    sortBy === "price" && order === "asc"
                                        ? "price_asc"
                                        : sortBy === "price" &&
                                          order === "desc"
                                        ? "price_desc"
                                        : "newest"
                                }
                                className="w-full bg-zinc-50 text-sm text-zinc-700 rounded-lg px-3 py-2 outline-none transition focus:bg-white focus:ring-1 focus:ring-zinc-300 cursor-pointer"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "price_asc") {
                                        updateSearchParams({
                                            sortBy: "price",
                                            order: "asc",
                                            page: 1,
                                        });
                                    } else if (value === "price_desc") {
                                        updateSearchParams({
                                            sortBy: "price",
                                            order: "desc",
                                            page: 1,
                                        });
                                    } else {
                                        updateSearchParams({
                                            sortBy: "createdAt",
                                            order: "desc",
                                            page: 1,
                                        });
                                    }
                                }}
                            >
                                <option value="newest">
                                    Newest
                                </option>

                                <option value="price_asc">
                                    Price: Low → High
                                </option>

                                <option value="price_desc">
                                    Price: High → Low
                                </option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* Products */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {category || "All Products"}
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                {pagination.total} products found
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-80 flex items-center justify-center py-20">
                            <InlineLoader size="xl" content="" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-zinc-500">
                            No products found.
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map((p) => (
                                    <ProductCard
                                        key={p._id}
                                        id={p._id}
                                        image={p.images[0]}
                                        name={p.name}
                                        price={p.price}
                                        category={p.category}
                                        mrp={p.mrp}
                                        sold={p.sold}
                                        inStock={Number(p.stock) > 0}
                                    />
                                ))}
                            </div>

                            {pagination.pages > 1 && (
                                <Pagination
                                    currentPage={page}
                                    totalPages={pagination.pages}
                                    setPage={(newPage) =>
                                        updateSearchParams({
                                            page: newPage,
                                        })
                                    }
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;