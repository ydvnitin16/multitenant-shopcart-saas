import Button from "@/components/ui/Button";
import { useRequestStore } from "../hooks/useRequestStore";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/ui/Input";
import { storeSchema } from "../validations/store";
import InlineLoader from "@/components/ui/InlineLoader";

const RequestStore = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(storeSchema),
    });

    const { storeRequestHandler, loading, error } = useRequestStore({ reset });

    return (
        <div className='min-h-screen bg-zinc-50 pt-28 px-6'>
            <div className='max-w-3xl mx-auto'>
                {/* Card */}
                <p
                        className='text-end mb-3 text-emerald-500'>
                    <a
                        href='/store-request-status'
                    >
                        ← Requested Store Status
                    </a>
                </p>

                <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 space-y-8'>
                    {/* Header */}
                    <div>
                        <h1 className='text-2xl font-semibold text-zinc-900'>
                            Request a Store
                        </h1>
                        <p className='text-sm text-zinc-500 mt-2'>
                            Submit your store details. Our team will review and
                            approve your request.
                        </p>
                    </div>

                    {error && (
                        <div className='bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg p-4'>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit(storeRequestHandler)}
                        className='space-y-6'
                    >
                        {/* Store Name */}
                        <Input
                            label={"Store Name"}
                            error={errors.name?.message}
                            {...register("name")}
                            type='text'
                            placeholder='you@example.com'
                        />

                        {/* Store slug */}
                        <Input
                            label={"Store Slug"}
                            error={errors.slug?.message}
                            {...register("slug")}
                            type='text'
                            placeholder='apple-store'
                        />

                        {/* Description */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-zinc-700'>
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                className='w-full border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500'
                                placeholder='Tell us about your store'
                            />
                            {errors.description && (
                                <p className='text-xs text-red-500'>
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Email & Contact */}
                        <div className='grid md:grid-cols-2 gap-6'>
                            <Input
                                label={"Email"}
                                error={errors.email?.message}
                                {...register("email")}
                                type='email'
                                placeholder='store@example.com'
                            />

                            <Input
                                label={"Contact Number"}
                                error={errors.contact?.message}
                                {...register("contact")}
                                type='number'
                                placeholder='+91 95824 6XXXX'
                            />
                        </div>

                        {/* Address */}
                        <Input
                            label={"Store Address"}
                            error={errors.address?.message}
                            {...register("address")}
                            type='text'
                            placeholder='Apple store opposite XYZ School near ABC Chowk, Haryana, India'
                        />

                        {/* Image Upload */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-zinc-700'>
                                Store Logo / Image
                            </label>

                            <input
                                type='file'
                                accept='image/*'
                                {...register("image")}
                                className='w-full text-sm text-zinc-600 
                                file:mr-4 file:py-2 file:px-4 
                                file:rounded-lg file:border-0 
                                file:bg-emerald-600 file:text-white 
                                hover:file:bg-emerald-500'
                            />

                            {errors.image && (
                                <p className='text-xs text-red-500'>
                                    {errors.image.message}
                                </p>
                            )}
                        </div>

                        <div className='bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm rounded-lg p-4'>
                            Your request will be reviewed. Once approved, your
                            store will be visible on the platform.
                        </div>

                        {/* Submit */}
                        <div className='pt-2'>
                            {loading ? (
                                <InlineLoader content='Requesting...' />
                            ) : (
                                <Button
                                    size='lg'
                                    type='submit'
                                    className='w-full'
                                >
                                    Submit Request
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestStore;
