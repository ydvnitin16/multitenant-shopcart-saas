import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import { productsData } from "../data/productsData";
import { useProducts } from "../hooks/useProducts";
import Pagination from "@/components/ui/Pagination";
import InlineLoader from "@/components/ui/InlineLoader";

const Shop = () => {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({
        sortBy: "createdAt",
        order: "desc",
    });

    const { loading, products, pagination, error } = useProducts({
        page: page,
        limit: 10,
        sortBy: sort.sortBy,
        order: sort.order,
    });

    return (
        <div className='max-w-7xl mx-auto px-4 py-10 mt-10'>
            <div className='flex gap-8'>
                {/* 🔹 Sidebar */}
                <aside className='w-64 hidden lg:block'>
                    <div className='sticky top-24 space-y-10'>
                        {/* Category */}
                        <div>
                            <h3 className='text-sm font-semibold text-zinc-900 mb-4 tracking-tight'>
                                Category
                            </h3>

                            <select className='w-full bg-zinc-50 text-sm text-zinc-700 rounded-lg px-3 py-2 outline-none transition focus:bg-white focus:ring-1 focus:ring-zinc-300'>
                                <option value=''>All</option>
                                <option value='electronics'>Electronics</option>
                                <option value='fashion'>Fashion</option>
                                <option value='accessories'>Accessories</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className='text-sm font-semibold text-zinc-900 mb-4 tracking-tight'>
                                Sort By
                            </h3>

                            <select
                                className='w-full bg-zinc-50 text-sm text-zinc-700 rounded-lg px-3 py-2 outline-none transition focus:bg-white focus:ring-1 focus:ring-zinc-300 cursor-pointer'
                                onChange={(e) => {
                                    const value = e.target.value;

                                    if (value === "price_asc")
                                        setSort({
                                            sortBy: "price",
                                            order: "asc",
                                        });
                                    else if (value === "price_desc")
                                        setSort({
                                            sortBy: "price",
                                            order: "desc",
                                        });
                                    else if (value === "newest")
                                        setSort({
                                            sortBy: "createdAt",
                                            order: "desc",
                                        });

                                    setPage(1);
                                }}
                            >
                                <option value='newest'>Default</option>
                                <option value='price_asc'>
                                    Price: Low → High
                                </option>
                                <option value='price_desc'>
                                    Price: High → Low
                                </option>
                                <option value='newest'>Newest</option>
                            </select>
                        </div>
                    </div>
                </aside>

                {/* 🔹 Products Section */}
                <div className='flex-1'>
                    {/* Header */}
                    <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-semibold'>All Products</h2>
                    </div>

                    {loading ? (
                        <div className='h-80 flex items-center justify-center py-20'>
                            <InlineLoader size='xl' content='' />
                        </div>
                    ) : (
                        products.length === 0 && (
                            <div className='text-center py-20 text-zinc-500'>
                                No products found.
                            </div>
                        )
                    )}

                    {/* PRODUCTS */}
                    {products.length > 0 && (
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
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
                                    inStock={p.inStock}
                                />
                            ))}
                        </div>
                    )}

                    {pagination.pages > 1 && (
                        <Pagination
                            currentPage={page}
                            totalPages={pagination.pages}
                            setPage={setPage}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Shop;
