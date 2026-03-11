import { useParams } from "react-router-dom";
import { vendorsData } from "../data/vendorsData";
import ProductCard from "../components/ProductCard";
import { productsData } from "../data/productsData";

const VendorShop = () => {
    const { storeSlug } = useParams();
    const store = vendorsData[2];
    const product = productsData[0];
    return (
        <div className='bg-zinc-50 min-h-screen pb-16'>
            {/* Cover Section */}
            <div className='relative'>
                <div className='h-56 md:h-72 w-full bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-b-3xl' />

                {/* Store Card */}
                <div className='max-w-6xl mx-auto px-6'>
                    <div className='bg-white rounded-2xl shadow-md border border-zinc-200 -mt-20 p-6 md:p-8 flex flex-col gap-6'>
                        {/* Left Side */}
                        <div className='flex items-start gap-5'>
                            <img
                                src={store.logo}
                                className='w-20 h-20 rounded-2xl object-cover shadow-sm'
                            />

                            <div>
                                <h1 className='text-2xl font-semibold text-zinc-900'>
                                    {store.name}{" "}
                                    <span className='bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-md text-xs font-medium'>
                                        {store.category ?? "Fashion"}
                                    </span>
                                </h1>

                                <div className='flex items-center gap-3 mt-2 text-sm text-zinc-600'>
                                    <span className='bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md text-xs font-medium'>
                                        Official Partner
                                    </span>
                                    <span>⭐ 4.8 (2,482 reviews)</span>
                                </div>
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
                                        support@techhaven.com
                                    </p>
                                </div>

                                <div>
                                    <p className='text-xs text-zinc-400'>
                                        HEADQUARTERS
                                    </p>
                                    <p className='font-medium text-zinc-900'>
                                        San Francisco, CA
                                    </p>
                                </div>

                                <div>
                                    <p className='text-xs text-zinc-400'>
                                        MEMBER SINCE
                                    </p>
                                    <p className='font-medium text-zinc-900'>
                                        October 2021
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className='max-w-6xl mx-auto px-6 mt-14'>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-xl font-semibold text-zinc-900'>
                        Products
                    </h2>
                    <p className='text-sm text-zinc-500'>Showing 24 products</p>
                </div>

                <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {/* Product Card */}
                    <ProductCard
                        title={product.title}
                        image={product.image[1]}
                        price={product.price}
                        mrp={product.mrp}
                    />
                </div>
            </div>
        </div>
    );
};

export default VendorShop;
