import { Star, Truck, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import InlineLoader from "@/components/ui/InlineLoader";
import PhotoMediaGallary from "@/components/ui/ProductMediaGallary";

const Product = () => {
    const { productId } = useParams();

    const { loading, product, error } = useProduct({ productId });
    const [quantity, setQuantity] = useState(1);

    if (loading) {
        return <InlineLoader content='' />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const discount = product.mrp
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;

    return (
        <div className='min-h-screen bg-zinc-50 pt-8 px-6'>
            <div className='max-w-6xl mx-auto space-y-12'>
                {/* Breadcrumb */}
                <div className='text-sm text-zinc-500'>
                    <Link to='/' className='hover:text-black'>
                        Home
                    </Link>
                    <span className='mx-2'>/</span>
                    <Link to='/shop' className='hover:text-black'>
                        Products
                    </Link>
                    <span className='mx-2'>/</span>
                    <span className='text-zinc-600 font-medium'>
                        {product.name}
                    </span>
                </div>

                <div className='grid lg:grid-cols-2 gap-12 items-start'>
                    <PhotoMediaGallary
                        title={product.name}
                        images={product.images}
                    />

                    {/* product Info */}
                    <div className='space-y-6'>
                        <h1 className='text-2xl font-semibold text-zinc-900'>
                            {product.title}
                        </h1>

                        <div className='flex items-center gap-2 text-sm text-zinc-600'>
                            <div className='flex text-emerald-500'>
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={16}
                                        fill='currentColor'
                                    />
                                ))}
                            </div>
                            <span>4.8 • 120 Reviews</span>
                        </div>

                        <div className='space-y-1'>
                            <div className='flex items-center gap-3'>
                                <span className='text-3xl font-bold text-zinc-900'>
                                    ₹{product.price}
                                </span>

                                {product.mrp && (
                                    <>
                                        <span className='text-lg text-zinc-400 line-through'>
                                            ₹{product.mrp}
                                        </span>
                                        <span className='text-sm text-emerald-600 font-medium'>
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {product.inStock ? (
                                <p className='text-sm text-emerald-600 font-medium'>
                                    In Stock • Ready to ship
                                </p>
                            ) : (
                                <p className='text-sm text-red-600 font-medium'>
                                    Currently out of stock
                                </p>
                            )}
                        </div>

                        <p className='text-lg font-semibold text-zinc-600 leading-relaxed'>
                            {product.name}
                        </p>

                        <div>
                            <p className='text-sm font-medium mb-2'>Quantity</p>
                            <div className='flex items-center border border-zinc-200 rounded-lg w-fit'>
                                <button
                                    onClick={() =>
                                        setQuantity((q) => (q > 1 ? q - 1 : 1))
                                    }
                                    className='px-4 py-2 text-zinc-500 hover:text-black'
                                >
                                    -
                                </button>
                                <span className='px-6 text-sm'>{quantity}</span>
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className='px-4 py-2 text-zinc-500 hover:text-black'
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <Button size='lg' className='w-full'>
                            Add to Cart
                        </Button>

                        <div className='pt-6 border-t border-zinc-200 space-y-3 text-sm text-zinc-600'>
                            <div className='flex items-center gap-2'>
                                <Truck size={16} />
                                Free shipping
                            </div>
                            <div className='flex items-center gap-2'>
                                <ShieldCheck size={16} />
                                Secure payment
                            </div>
                        </div>
                    </div>
                </div>

                <div className='gap-3 px-6 mt-6 flex items-center '>
                    <img
                        className='rounded-full h-10 w-10 border border-zinc-200 p-1'
                        src={product.storeId?.image?.url}
                        alt={product.storeId.name}
                    />
                    <div>
                        <p className='text-base font-semibold text-zinc-900'>
                            {product.storeId.name}
                        </p>
                        <a
                            href={`/vendor/${product.storeId.slug}`}
                            className='text-sm font-medium text-emerald-600 hover:underline'
                        >
                            Visit Shop →
                        </a>
                    </div>
                </div>

                <div className='bg-white rounded-2xl border border-zinc-200 p-8'>
                    <h2 className='text-lg font-semibold mb-4'>
                        Product Description
                    </h2>
                    <p className='text-sm text-zinc-600 leading-relaxed'>
                        {product.description}
                    </p>
                </div>

                <div className='bg-white rounded-2xl border border-zinc-200 p-8 mt-6'>
                    <h2 className='text-lg font-semibold mb-6'>
                        Customer Reviews
                    </h2>

                    <div className='flex items-center gap-4 mb-6'>
                        <span className='text-3xl font-bold'>4.5</span>
                        <div className='text-yellow-500 text-lg'>★★★★☆</div>
                        <span className='text-sm text-zinc-500'>
                            Based on 128 reviews
                        </span>
                    </div>

                    <div className='border-t border-zinc-200 pt-4 space-y-2'>
                        <div className='flex items-center justify-between'>
                            <p className='font-medium'>Rahul Sharma</p>
                            <span className='text-sm text-zinc-500'>
                                2 days ago
                            </span>
                        </div>

                        <div className='text-yellow-500 text-sm'>★★★★☆</div>

                        <p className='text-sm text-zinc-600 leading-relaxed'>
                            Great quality product. Packaging was neat and
                            delivery was fast. Would definitely purchase again.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
