import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useParams } from 'react-router-dom';
import useAddProduct from '../hooks/useAddProduct';
import InlineLoader from '@/components/ui/InlineLoader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema } from '../validations/product';

const AddProduct = () => {
    const { storeSlug } = useParams();

    // yup validations
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(productSchema),
    });

    // Hook to handle everything about add prodcut
    const { loading, error, onSubmit, images, handleImageChange } =
        useAddProduct({ storeSlug, reset });

    return (
        <div className="min-h-screen px-2 md:px-5 py-12">
            <div className="mx-auto max-w-4xl">
                <div className="mb-10">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Add Product
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Add basic information for your new product.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                    {/* Images Input for product images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Images
                        </label>

                        <label className="mt-4 flex aspect-square w-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-zinc-200">
                            <CloudUpload className="h-10 w-10 text-gray-400" />
                            <span className="mt-2 text-xs text-gray-500">
                                Upload
                            </span>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>

                        {/* Preview */}
                        <div className="mt-4 flex gap-3 flex-wrap">
                            {images?.map((file, index) => (
                                <img
                                    key={index}
                                    src={URL.createObjectURL(file)}
                                    className="h-20 w-20 rounded-md object-cover"
                                />
                            ))}
                        </div>
                    </div>

                    <Input
                        {...register('name')}
                        error={errors.name?.message}
                        label={'Product Name'}
                        placeholder={'Apple iPhone 15 Pro'}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            rows="5"
                            placeholder="Write a short description about the product..."
                            className="mt-3 w-full resize-none rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none"
                        />
                        {errors.description?.message && (
                            <p className="text-xs text-red-500">
                                {errors.description?.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <Input
                            error={errors.category?.message}
                            {...register('category')}
                            label="Category"
                            placeholder="Electronics"
                            type="text"
                        />
                        <Input
                            error={errors.stock?.message}
                            {...register('stock')}
                            label="Stock"
                            placeholder="25"
                            type="number"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        <Input
                            error={errors.price?.message}
                            {...register('price')}
                            label="Price"
                            placeholder="₹ 999"
                            type="number"
                        />
                        <Input
                            error={errors.mrp?.message}
                            {...register('mrp')}
                            label="MRP"
                            placeholder="₹ 1299"
                            type="number"
                        />
                    </div>

                    <div className="pt-6">
                        <>
                            {loading ? (
                                <InlineLoader content="Adding Product..." />
                            ) : (
                                <Button type="submit">Add Product</Button>
                            )}
                            {error && (
                                <p className="text-xs text-red-500">{error}</p>
                            )}
                        </>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
