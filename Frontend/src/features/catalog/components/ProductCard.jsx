import LazyImage from "@/components/ui/LazyImage";
import { Heart, Plus } from "lucide-react";

const ProductCard = ({ image, title, price, mrp }) => {
    return (
        <div className="w-[220px] shrink-0 rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md">
            
            {/* Image Section */}
            <div className="relative mb-4 h-44 overflow-hidden rounded-xl bg-gray-100">
                <button className="absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 shadow-sm">
                    <Heart
                        size={16}
                        className="text-gray-400 hover:text-green-500"
                    />
                </button>
                <LazyImage src={image} alt={title} className="h-full w-full object-cover" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 truncate">
                {title}
            </h3>

            {/* Price Section */}
            <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-gray-900">
                            ₹{price}
                        </span>

                        {mrp && (
                            <span className="text-xs text-gray-400 line-through">
                                ₹{mrp}
                            </span>
                        )}
                    </div>

                    {mrp && (
                        <span className="text-xs text-green-600 font-medium">
                            {Math.round(((mrp - price) / mrp) * 100)}% OFF
                        </span>
                    )}
                </div>

                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition hover:bg-green-600">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
