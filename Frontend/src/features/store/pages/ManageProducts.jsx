import React, { useState } from "react";
import Input from "@/components/ui/Input";
import ProductDetailsCard from "../components/ProductDetailsCard";
import useStoreProducts from "../hooks/useStoreProducts";
import { useParams } from "react-router-dom";
import Loader from "@/components/ui/Loader";
import ProductListItem from "../components/ProductListItem";
import useUpdateStock from "../hooks/useUpdateStock";

const ManageProducts = () => {
    const { storeSlug } = useParams();
    const { loading, error, products, setProducts } = useStoreProducts({
        storeSlug,
    });

    // we are passing setProducts to update stock status in the hook to direclty update the state with the updated stock status
    const { updateStock } = useUpdateStock({ setProducts });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        // Open modal only on small screens
        if (window.innerWidth < 1024) {
            setIsModalOpen(true);
        }
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='text-xl font-semibold tracking-tight'>
                            Products
                        </h1>
                        <p className='text-sm text-zinc-500'>
                            Manage pricing, stock, and visibility of your
                            products
                        </p>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='w-80'>
                        <Input placeholder='Search by name or category...' />
                    </div>
                </div>

                {/* Listing all the products of the particular store */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    <div className='lg:col-span-2 rounded-xl border border-zinc-200 bg-white'>
                        <div className='grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-200 text-xs text-zinc-500'>
                            <div className='col-span-5'>Name</div>
                            <div className='col-span-2'>Category</div>
                            <div className='col-span-2 text-right'>Price</div>
                            <div className='col-span-3 text-right'>Stock</div>
                        </div>

                        <div className='divide-y divide-zinc-200'>
                            {products?.map((product, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        handleProductSelect(product);
                                    }}
                                    className='cursor-pointer'
                                >
                                    <ProductListItem
                                        product={product}
                                        storeSlug={storeSlug}
                                        updateStock={updateStock}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right side details bar always visible in large screens */}
                    <div className='hidden lg:block'>
                        {selectedProduct ? (
                            <ProductDetailsCard
                                product={selectedProduct}
                                onClose={() => setSelectedProduct(null)}
                            />
                        ) : (
                            <div className='rounded-xl border border-zinc-200 bg-white p-6 text-center'>
                                <p className='text-sm text-zinc-500'>
                                    Select a product to view details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* when user click on small screen modal set to open and modal visible */}
            {isModalOpen && selectedProduct && (
                <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px] p-4 lg:hidden'>
                    <div className='w-full max-w-md rounded-xl  max-h-[90vh] overflow-y-auto'>
                        <ProductDetailsCard
                            product={selectedProduct}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageProducts;
