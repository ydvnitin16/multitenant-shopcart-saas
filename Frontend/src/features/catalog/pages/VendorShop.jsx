import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useFetch from "@/hooks/useFetch";
import InlineLoader from "@/components/ui/InlineLoader";
import { useMemo, useState } from "react";
import StoreFrontInfo from "../components/StoreFrontInfo";

const VendorShop = () => {
    const { storeSlug } = useParams();
    const { data, loading, error } = useFetch(
        storeSlug ? `/stores/${storeSlug}` : null,
    );
    const store = data?.store;
    const storeId = store?._id;

    const productsEndpoint = useMemo(() => {
        if (!storeId) {
            return null;
        }

        const params = new URLSearchParams({
            store: storeId,
        });

        return `/products?${params.toString()}`;
    }, [storeId]);

    const {
        data: productsData,
        loading: productsLoading,
        error: productsError,
    } = useFetch(productsEndpoint);
    const products = productsData?.products || [];
    const errorMessage = error?.message || productsError?.message;

    if (loading || productsLoading) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <InlineLoader content='Loading store...' />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className='flex min-h-screen items-center justify-center text-red-600'>
                {errorMessage}
            </div>
        );
    }

    if (!store) {
        return (
            <div className='flex min-h-screen items-center justify-center text-zinc-600'>
                Store not found.
            </div>
        );
    }

    return (
        <div className='bg-zinc-50 min-h-screen pb-16'>
            {/* Cover  */}
            <div className='relative'>
                <div className='h-56 md:h-72 w-full bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-b-3xl' />

                <StoreFrontInfo store={store} />
            </div>

            {/* Products Section */}
            <div className='max-w-6xl mx-auto px-6 mt-14'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h2 className='text-xl font-semibold text-zinc-900'>
                            Products
                        </h2>
                        <p className='text-sm text-zinc-500'>
                            Showing {products.length} products
                        </p>
                    </div>
                </div>

                <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {[...products].map((product) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            image={product.images?.[0]}
                            name={product.name}
                            category={product.category}
                            price={product.price}
                            mrp={product.mrp}
                            inStock={Number(product.stock) > 0}
                            sold={product.sold}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VendorShop;
