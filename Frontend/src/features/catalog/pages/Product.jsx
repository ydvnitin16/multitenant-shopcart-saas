import { Star, Truck, ShieldCheck, MoveRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import InlineLoader from "@/components/ui/InlineLoader";
import PhotoMediaGallary from "@/components/ui/ProductMediaGallary";
import useCartStore from "../../../stores/useCartStore";
import { formatPrice } from "@/utils/formatPrice";
import Markdown from "react-markdown";
import useFetch from "@/hooks/useFetch";

const Product = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const { data, loading, error } = useFetch(
        productId ? `/products/${productId}` : null,
    );
    const product = data?.product || null;
    const [quantity, setQuantity] = useState(1);

    const { addToCart, cart } = useCartStore();
    const isAlreadyInCart = product
        ? cart.some((item) => item.productId === product._id)
        : false;

    const handleCart = (productId, quantity) => {
        addToCart(productId, quantity);
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <InlineLoader size='xl' content='' />
            </div>
        );
    }

    if (error) {
        return <p>{error.message}</p>;
    }

    const discount = product?.mrp
        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
        : 0;
    return (
        <>
            {product && (
                <div className='min-h-screen bg-zinc-50 pt-8 px-6'>
                    <div className='max-w-6xl mx-auto space-y-12 pb-10'>
                        <div className='grid lg:grid-cols-2 gap-12 items-start'>
                            <PhotoMediaGallary
                                title={product.name}
                                images={product.images}
                            />

                            {/* product Info */}
                            <div className='space-y-6'>
                                <h1 className='text-2xl font-semibold text-zinc-900'>
                                    {product.name}
                                </h1>

                                <div className='space-y-1'>
                                    <div className='flex items-center gap-3'>
                                        <span className='text-3xl font-bold text-zinc-900'>
                                            {formatPrice(product.price)}
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

                                    {Number(product.stock) > 0 ? (
                                        <p className='text-sm text-emerald-600 font-medium'>
                                            In Stock • Ready to ship
                                        </p>
                                    ) : (
                                        <p className='text-sm text-red-600 font-medium'>
                                            Currently out of stock
                                        </p>
                                    )}
                                </div>
                                {/* Add to cart & Buy Now */}
                                {Number(product.stock) > 0 && (
                                    <>
                                        <div>
                                            <p className='text-sm font-medium mb-2'>
                                                Quantity
                                            </p>
                                            <div className='flex items-center border border-zinc-200 rounded-lg w-fit'>
                                                <button
                                                    onClick={() =>
                                                        setQuantity((q) =>
                                                            q > 1 ? q - 1 : 1,
                                                        )
                                                    }
                                                    className='px-4 py-2 text-zinc-500 hover:text-black'
                                                >
                                                    -
                                                </button>
                                                <span className='px-6 text-sm'>
                                                    {quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setQuantity(
                                                            (q) => q + 1,
                                                        )
                                                    }
                                                    className='px-4 py-2 text-zinc-500 hover:text-black'
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <Button
                                                onClick={() =>
                                                    handleCart(
                                                        product._id,
                                                        quantity,
                                                    )
                                                }
                                                size='lg'
                                                variant={"secondary"}
                                                className='w-full'
                                            >
                                                Add to Cart
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    !isAlreadyInCart &&
                                                        handleCart(
                                                            product._id,
                                                            quantity,
                                                        );
                                                    navigate("/cart");
                                                }}
                                                size='lg'
                                                variant={"primary"}
                                                className='w-full'
                                            >
                                                Buy Now
                                            </Button>
                                        </div>
                                    </>
                                )}

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

                        {/* Store */}
                        <div className='gap-3 px-6 mt-6 flex items-center '>
                            <img
                                className='rounded-full h-10 w-10 border border-zinc-200 p-1'
                                src={product.store?.image?.url}
                                alt={product.store?.name}
                            />
                            <div>
                                <p className='text-base font-semibold text-zinc-900'>
                                    {product.store?.name}
                                </p>
                                <a
                                    href={`/vendor/${product.store?.slug}`}
                                    className='text-sm font-medium text-emerald-600 hover:underline'
                                >
                                    Visit Shop →
                                </a>
                            </div>
                        </div>

                        {/* Description */}
                        <div className='bg-white rounded-2xl border border-zinc-200 p-8'>
                            <h2 className='text-lg font-semibold mb-4'>
                                Product Description
                            </h2>
                            <p className='text-sm text-zinc-600 leading-relaxed'>
                                <Markdown>{product.description}</Markdown>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Product;
