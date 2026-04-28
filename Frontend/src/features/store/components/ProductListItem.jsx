// ProductListItem.jsx

import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const ProductListItem = ({ product }) => {
    const stock = Number(product.stock);

    const stockLabel =
        stock === 0
            ? "Out of stock"
            : stock <= 5
              ? `${stock} remaining`
              : `${stock} in stock`;

    const stockStyle =
        stock === 0
            ? "bg-zinc-100 text-zinc-500"
            : stock <= 5
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700";

    const isActive = stock > 0;

    return (
        <div className='grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 py-4 hover:bg-zinc-50 items-start md:items-center'>
            {/* Product */}
            <div className='md:col-span-5 flex gap-3 min-w-0'>
                <div className='h-12 w-12 rounded-xl overflow-hidden bg-zinc-100 shrink-0'>
                    <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className='h-full w-full object-contain'
                    />
                </div>

                <div className='min-w-0'>
                    <p className='text-sm font-semibold truncate'>
                        {product.name}
                    </p>

                    <p className='text-xs text-zinc-500 truncate'>
                        Category: {product.category || "General"}
                    </p>
                </div>
            </div>

            {/* Price */}
            <div className='md:col-span-2 text-sm font-semibold md:self-center'>
                ₹{product.price}
            </div>

            {/* Stock */}
            <div className='md:col-span-4 md:self-center'>
                <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${stockStyle}`}
                >
                    {stockLabel}
                </span>
            </div>
        </div>
    );
};

export default ProductListItem;
