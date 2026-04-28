// ManageProducts.jsx

import React, { useEffect, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import ProductDetailsCard from "../components/ProductDetailsCard";
import useStoreProducts from "../hooks/useStoreProducts";
import { useParams } from "react-router-dom";
import Loader from "@/components/ui/Loader";
import ProductListItem from "../components/ProductListItem";
import useUpdateProduct from "../hooks/useUpdateProduct";
import useDeleteProduct from "../hooks/useDeleteProduct";
import UpdateProductModal from "../components/UpdateProductModal";

const ManageProducts = () => {
    const { storeSlug } = useParams();

    const { loading, products, setProducts } = useStoreProducts({ storeSlug });
    const {
        updateProduct,
        loading: updateLoading,
        error: updateError,
    } = useUpdateProduct({ storeSlug, setProducts });
    const {
        deleteProduct,
        loading: deleteLoading,
        error: deleteError,
    } = useDeleteProduct({ storeSlug, setProducts });

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    useEffect(() => {
        if (!selectedProduct) {
            return;
        }

        const nextSelectedProduct = products.find(
            (product) => product._id === selectedProduct._id,
        );

        if (!nextSelectedProduct) {
            setSelectedProduct(null);
            setIsModalOpen(false);
            setIsUpdateModalOpen(false);
            return;
        }

        setSelectedProduct(nextSelectedProduct);
    }, [products, selectedProduct]);

    const filteredProducts = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return products;
        }

        return products.filter((product) =>
            [product.name, product.category]
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(normalizedQuery)),
        );
    }, [products, searchQuery]);

    const handleSelect = (product) => {
        setSelectedProduct(product);

        if (window.innerWidth < 1024) {
            setIsModalOpen(true);
        }
    };

    const handleOpenUpdateModal = (product) => {
        setSelectedProduct(product);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false);
    };

    const handleSaveProduct = async (productId, formData) => {
        await updateProduct(productId, formData);
        setIsUpdateModalOpen(false);
    };

    const handleDeleteProduct = async (productId) => {
        await deleteProduct(productId);
    };

    if (loading) return <Loader />;

    return (
        <>
            <div className='space-y-6'>
                {/* Header */}
                <div>
                    <h1 className='text-2xl font-semibold'>Products</h1>

                    <p className='text-sm text-zinc-500 mt-1'>
                        Manage pricing, stock and visibility of your products
                    </p>
                </div>

                {/* Search */}
                <div className='max-w-sm'>
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search by name or category...'
                    />
                </div>

                {/* Main Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start'>
                    {/* Left Table */}
                    <div className='lg:col-span-8 rounded-2xl border border-zinc-200 bg-white overflow-hidden'>
                        {/* Header */}
                        <div className='hidden md:grid grid-cols-12 px-5 py-4 bg-zinc-50 border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500'>
                            <div className='col-span-5'>Product</div>
                            <div className='col-span-2'>Price</div>
                            <div className='col-span-4'>Stock</div>
                        </div>

                        {/* Rows */}
                        <div className='divide-y divide-zinc-100'>
                            {filteredProducts?.map((product) => (
                                <div
                                    key={product._id}
                                    onClick={() => handleSelect(product)}
                                    className='cursor-pointer'
                                >
                                    <ProductListItem product={product} />
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className='px-5 py-4 border-t border-zinc-100 text-sm text-zinc-500'>
                            Showing 1 to {filteredProducts?.length} of{" "}
                            {products?.length} products
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className='hidden lg:block lg:col-span-4 sticky top-24'>
                        {selectedProduct ? (
                            <ProductDetailsCard
                                product={selectedProduct}
                                onClose={() => setSelectedProduct(null)}
                                onEdit={handleOpenUpdateModal}
                                onDelete={handleDeleteProduct}
                                deleteLoading={deleteLoading}
                            />
                        ) : (
                            <div className='rounded-2xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500'>
                                Select a product to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile */}
            {isModalOpen && selectedProduct && (
                <div className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4 lg:hidden'>
                    <div className='w-full max-w-md max-h-[90vh] overflow-y-auto'>
                        <ProductDetailsCard
                            product={selectedProduct}
                            onClose={() => setIsModalOpen(false)}
                            onEdit={handleOpenUpdateModal}
                            onDelete={handleDeleteProduct}
                            deleteLoading={deleteLoading}
                        />
                    </div>
                </div>
            )}

            {isUpdateModalOpen && selectedProduct && (
                <UpdateProductModal
                    product={selectedProduct}
                    onClose={handleCloseUpdateModal}
                    onSave={handleSaveProduct}
                    loading={updateLoading}
                    error={updateError}
                />
            )}

            {deleteError && (
                <p className='mt-4 text-sm text-red-600'>{deleteError}</p>
            )}
        </>
    );
};

export default ManageProducts;
