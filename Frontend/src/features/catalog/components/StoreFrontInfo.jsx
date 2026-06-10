import Badge from "@/components/ui/Badge";
import React from "react";

const StoreFrontInfo = ({ store }) => {
    console.log(store);
    return (
        <div className='max-w-6xl mx-auto px-6'>
            <div className='bg-white rounded-2xl shadow-md border border-zinc-200 -mt-20 p-6 md:p-8 flex flex-col gap-6'>
                <div className='flex items-start gap-5'>
                    <img
                        src={store.image?.url}
                        className='w-20 h-20 rounded-2xl object-cover shadow-sm'
                    />

                    <div>
                        <h1 className='text-2xl font-semibold text-zinc-900'>
                            {store.name}
                        </h1>
                        <Badge content={"Official Partner"} variant='blue' />
                    </div>
                </div>

                <div className='flex justify-between flex-col md:flex-row gap-8'>
                    <div className='md:col-span-2 '>
                        <h2 className='text-lg font-semibold mb-4 text-zinc-900'>
                            About the Store
                        </h2>

                        <p className='text-sm text-zinc-600 leading-relaxed'>
                            {store.description}
                        </p>
                    </div>

                    {/* Store Info */}
                    <div className='bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-4 text-sm text-zinc-600'>
                        <div>
                            <p className='text-xs text-zinc-400'>
                                SUPPORT EMAIL
                            </p>
                            <p className='font-medium text-zinc-900'>
                                {store.email}
                            </p>
                        </div>

                        <div>
                            <p className='text-xs text-zinc-400'>
                                HEADQUARTERS
                            </p>
                            <p className='font-medium text-zinc-900'>
                                {store.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreFrontInfo;
