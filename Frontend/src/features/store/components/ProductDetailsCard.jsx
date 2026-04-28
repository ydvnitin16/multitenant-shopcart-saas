// ProductDetailsCard.jsx

import React from "react";
import { XIcon, Pencil, Trash2 } from "lucide-react";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";

const ProductDetailsCard = ({
    product,
    onClose,
    onEdit,
    onDelete,
    deleteLoading = false,
}) => {
    if (!product) return null;

    const inStock = Number(product.stock) > 0;

    return (
        <div className='rounded-2xl border border-zinc-200 bg-white overflow-hidden'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-4 border-b border-zinc-200'>
                <p className='font-medium'>Product Details</p>

                <button
                    onClick={onClose}
                    className='p-2 rounded-lg hover:bg-zinc-100'
                >
                    <XIcon size={18} />
                </button>
            </div>

            <div className='p-5 space-y-5'>
                {/* Image */}
                <div className='rounded-xl overflow-hidden bg-zinc-100 h-48'>
                    <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className='h-full w-full object-contain'
                    />
                </div>

                {/* Name */}
                <div>
                    <p className='text-xs text-zinc-500'>Name</p>
                    <p className='font-medium'>{product.name}</p>
                </div>

                {/* Price */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-zinc-500'>MRP</p>
                        <p className='line-through text-zinc-500 text-sm'>
                            ₹{product.mrp}
                        </p>
                    </div>

                    <div>
                        <p className='text-xs text-zinc-500'>Price</p>
                        <p className='font-semibold text-sm'>
                            ₹{product.price}
                        </p>
                    </div>
                </div>

                {/* Stock */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-zinc-500'>Units</p>
                        <p className='text-sm font-medium'>{product.stock}</p>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <div>
                        <p className='text-xs text-zinc-500'>Description</p>
                        <p className='text-sm text-zinc-700 mt-1'>
                            {product.description}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className='grid grid-cols-2 gap-3 pt-2'>
                    <Button
                        variant='secondary'
                        onClick={() => onEdit?.(product)}
                        className='h-11  flex items-center justify-center gap-2'
                    >
                        <Pencil size={16} />
                        Update
                    </Button>

                    <Button
                        variant='destructive'
                        onClick={() => onDelete?.(product._id)}
                        disabled={deleteLoading}
                        className='h-11 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60'
                    >
                        <Trash2 size={16} />
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsCard;
