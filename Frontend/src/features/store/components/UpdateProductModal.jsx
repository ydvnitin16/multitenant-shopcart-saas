// UpdateProductModal.jsx

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const UpdateProductModal = ({
    product,
    onClose,
    onSave,
    loading = false,
    error = null,
}) => {
    const [formData, setFormData] = useState({
        description: product?.description || "",
        mrp: product?.mrp || "",
        price: product?.price || "",
        stock: product?.stock || "",
        category: product?.category || "",
    });

    useEffect(() => {
        setFormData({
            description: product?.description || "",
            mrp: product?.mrp || "",
            price: product?.price || "",
            stock: product?.stock || "",
            category: product?.category || "",
        });
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await onSave(product._id, formData);
    };

    return (
        <div className='fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4'>
            <div className='w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden'>
                {/* Header */}
                <div className='flex items-center justify-between px-5 py-4 border-b border-zinc-200'>
                    <div>
                        <h2 className='font-semibold text-zinc-900'>
                            Update Product
                        </h2>

                        <p className='text-xs text-zinc-500 mt-1'>
                            {product.name}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className='p-2 rounded-lg hover:bg-zinc-100 transition'
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='p-5 space-y-5'>
                    {/* Category */}
                    <div>
                        <label className='text-sm font-medium text-zinc-700 mb-2 block'>
                            Category
                        </label>

                        <Input
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            placeholder='Enter category'
                        />
                    </div>

                    {/* Prices */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='text-sm font-medium text-zinc-700 mb-2 block'>
                                MRP
                            </label>

                            <Input
                                name='mrp'
                                type='number'
                                value={formData.mrp}
                                onChange={handleChange}
                                placeholder='0'
                            />
                        </div>

                        <div>
                            <label className='text-sm font-medium text-zinc-700 mb-2 block'>
                                Selling Price
                            </label>

                            <Input
                                name='price'
                                type='number'
                                value={formData.price}
                                onChange={handleChange}
                                placeholder='0'
                            />
                        </div>
                    </div>

                    {/* Stock */}
                    <div>
                        <label className='text-sm font-medium text-zinc-700 mb-2 block'>
                            Stock
                        </label>

                        <Input
                            name='stock'
                            type='number'
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder='0'
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className='text-sm font-medium text-zinc-700 mb-2 block'>
                            Description
                        </label>

                        <textarea
                            name='description'
                            rows='4'
                            value={formData.description}
                            onChange={handleChange}
                            placeholder='Write product description...'
                            className='w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none resize-none focus:border-zinc-400'
                        />
                    </div>

                    {/* Footer */}
                    <div className='flex justify-end gap-3 pt-2'>
                        <Button
                            type='button'
                            variant='secondary'
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <Button type='submit' disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                    {error && <p className='text-sm text-red-600'>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default UpdateProductModal;
