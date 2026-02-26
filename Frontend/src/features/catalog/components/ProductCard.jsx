import LazyImage from "@/components/ui/LazyImage";
import { formatPrice } from "@/utils/formatPrice";
import { Heart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ id, image, name, price, mrp, inStock, sold = 0 }) => {
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
                    alt={name}
                    className='h-full w-full object-cover'
                />
            </div>

            {/* Content */}
            <div className='flex flex-col flex-1 justify-between'>
                {/* name */}
                <div>
                    <h3 className='text-sm font-semibold text-gray-800 line-clamp-2'>
                        {name}
                    </h3>
                    <div className='flex text-emerald-500 mt-1'>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={13}
                                fill='black'
                                color='black'
                            />
                        ))}
                    </div>
                </div>

                {/* Price Section */}
                <div className='flex flex-col  mt-2'>
                    <div className='flex items-center gap-1'>
                        {hasDiscount && (
                            <>
                                <p className='text-sm text-gray-400 font-medium line-through'>
                                    {formatPrice(mrp)}
                                </p>
                                <p className='text-xs font-medium p-0.5 bg-blue-50 text-blue-600 rounded-sm mt-1'>
                                    -{discountPercent}%
                                </p>
                            </>
                        )}
                    </div>
                    <p className='font-bold text-xl'>{formatPrice(price)}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
