import Button from "@/components/ui/Button";
import LazyImage from "@/components/ui/LazyImage";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
    id,
    image,
    title,
    price,
    mrp,
    sold = 0,
}) => {
    const navigate = useNavigate();

    const hasDiscount = mrp && mrp > price;
    const discountPercent = hasDiscount
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    return (
        <div
            onClick={() => navigate(`/product/${id}`)}
            className='w-[220px] shrink-0 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md cursor-pointer flex flex-col'
        >
            {/* Image */}
            <div className='relative mb-4 h-44 overflow-hidden rounded-xl bg-gray-100'>
                <button
                    onClick={(e) => e.stopPropagation()}
                    className='absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 shadow-sm'
                >
                    <Heart
                        size={16}
                        className='text-gray-400 hover:text-red-500'
                    />
                </button>

                <LazyImage
                    src={image?.url}
                    alt={title}
                    className='h-full w-full object-cover'
                />
            </div>

            {/* Content */}
            <div className='flex flex-col flex-1'>
                {/* Title */}
                <h3 className='text-sm font-semibold text-gray-800 line-clamp-2'>
                    {title}
                </h3>

                {/* Price Section */}
                <div className='mt-3'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-bold text-gray-900'>
                                ₹{price}
                            </span>

                            {hasDiscount && (
                                <span className='text-xs text-gray-400 line-through'>
                                    ₹{mrp}
                                </span>
                            )}
                        </div>

                        {sold > 0 && (
                            <span className='text-xs text-zinc-500'>
                                ({sold})
                            </span>
                        )}
                    </div>

                    {hasDiscount && (
                        <p className='text-xs text-green-600 font-medium mt-1'>
                            {discountPercent}% OFF
                        </p>
                    )}
                </div>

                <div className='mt-auto pt-3'>
                    <Button
                        onClick={(e) => e.stopPropagation()}
                        variant='secondary'
                        size='sm'
                        className='w-full'
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
