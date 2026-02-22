import Toggle from "@/components/ui/Toggle";
import React, { useState } from "react";
import useUpdateStock from "../hooks/useUpdateStock";

const ProductListItem = ({ product, storeSlug, updateStock }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 py-3 hover:bg-zinc-50 items-center'>
            <div className='flex items-center gap-3 md:col-span-5'>
                <div className='h-12 w-12 rounded-md bg-zinc-100 overflow-hidden'>
                    <img
                        src={product.images[0]?.url}
                        alt={`${product.name} image`}
                        className='h-full w-full object-cover'
                    />
                </div>

                <div className='min-w-0'>
                    <p className='text-sm font-medium truncate'>
                        {product.name}
                    </p>
                </div>
            </div>

            <div className='md:col-span-2 text-sm text-zinc-600'>
                {product.category || "uncategorized"}
            </div>

            <div className='flex flex-col md:col-span-2 md:text-right text-sm font-medium'>
                <span className='line-through text-zinc-500 font-normal'>
                    ₹{product.mrp}
                </span>
                <span>₹{product.price}</span>
            </div>

            <div className='md:col-span-3 md:flex md:justify-end'>
                <Toggle
                    checked={product.inStock}
                    onChange={(e) => {
                        e.stopPropagation();
                        updateStock({
                            storeSlug,
                            productId: product._id,
                            inStock: !product.inStock,
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default ProductListItem;
