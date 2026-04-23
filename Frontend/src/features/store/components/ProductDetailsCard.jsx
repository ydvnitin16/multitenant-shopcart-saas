import React from "react";
import { XIcon } from "lucide-react";

const ProductDetailsCard = ({ product, onClose }) => {
    if (!product) return null;
    const isInStock = Number(product.stock) > 0;

    return (
        <div className='rounded-xl border border-zinc-200 bg-white'>
            <div className='flex items-center justify-between border-b border-zinc-200 px-4 py-3'>
                <p className='text-sm font-medium'>Product Details</p>
                <div
                    onClick={onClose}
                    className='p-2 rounded-md border border-zinc-300 bg-white cursor-pointer'
                >
                    <XIcon size={18} />
                </div>
            </div>

            <div className='space-y-6 px-4 py-4'>
                {/* Name */}
                <div>
                    <p className='text-xs text-zinc-500'>Name</p>
                    <p className='text-sm font-medium'>{product.name}</p>
                </div>

                {/* Category */}
                <div>
                    <p className='text-xs text-zinc-500'>Category</p>
                    <p className='text-sm text-zinc-700'>
                        {product.category || "N/A"}
                    </p>
                </div>

                {/* Pricing */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-zinc-500'>MRP</p>
                        <p className='text-sm line-through text-zinc-500'>
                            ₹{product.mrp}
                        </p>
                    </div>
                    <div>
                        <p className='text-xs text-zinc-500'>Selling Price</p>
                        <p className='text-sm font-semibold'>
                            ₹{product.price}
                        </p>
                    </div>
                </div>

                {/* Inventory */}
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <p className='text-xs text-zinc-500'>Stock Status</p>
                        <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                isInStock
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {isInStock ? "In Stock" : "Out of Stock"}
                        </span>
                    </div>
                    <div>
                        <p className='text-xs text-zinc-500'>Stock Units</p>
                        <p className='text-sm font-medium'>{product.stock || 0}</p>
                    </div>
                </div>

                <div>
                    <p className='text-xs text-zinc-500'>Units Sold</p>
                    <p className='text-sm font-medium'>{product.sold || 0}</p>
                </div>

                {/* Description */}
                {product.description && (
                    <div>
                        <p className='text-xs text-zinc-500'>Description</p>
                        <p className='text-sm text-zinc-700 leading-relaxed'>
                            {product.description}
                        </p>
                    </div>
                )}

                {/* Metadata */}
                <div className='grid grid-cols-2 gap-4 text-xs text-zinc-500'>
                    <div>
                        <p>Created At</p>
                        <p className='text-zinc-700'>
                            {product.createdAt
                                ? new Date(
                                      product.createdAt,
                                  ).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                    <div>
                        <p>Last Updated</p>
                        <p className='text-zinc-700'>
                            {product.updatedAt
                                ? new Date(
                                      product.updatedAt,
                                  ).toLocaleDateString()
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsCard;
