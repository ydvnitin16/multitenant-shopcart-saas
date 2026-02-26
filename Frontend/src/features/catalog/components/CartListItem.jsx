import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
const CartListItem = ({
    product,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
}) => {
    return (
        <div className='grid grid-cols-5 items-center px-6 py-5 border-b border-zinc-100'>
            <div className='col-span-3 flex items-center gap-4'>
                <div className='w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden'>
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className='w-full h-full object-cover'
                    />
                </div>

                <div>
                    <h3 className='text-sm font-semibold text-zinc-900'>
                        {product.name}
                    </h3>
                    <p className='text-xs text-zinc-500'>Color: Space Gray</p>
                </div>
            </div>
            <span className='text-sm font-medium text-zinc-900'>
                {formatPrice(product.price)}
            </span>

            <div className='flex items-center gap-2'>
                <div className='flex items-center border border-zinc-200 rounded-lg'>
                    <button
                        onClick={() => decreaseQuantity(product._id)}
                        className='px-2 py-1 text-zinc-500 hover:text-black'
                    >
                        <Minus size={14} />
                    </button>

                    <span className='px-3 text-sm'>{product.quantity}</span>

                    <button
                        onClick={() => increaseQuantity(product._id)}
                        className='px-2 py-1 text-zinc-500 hover:text-black'
                    >
                        <Plus size={14} />
                    </button>
                </div>

                <button
                    onClick={() => removeFromCart(product._id)}
                    className='text-zinc-400 hover:text-red-500 cursor-pointer'
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default CartListItem;
