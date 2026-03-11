import { formatPrice } from "@/utils/formatPrice";
import React from "react";

const OrderItem = ({ item }) => {
    return (
        <div className='mb-2 flex items-center gap-4'>
            <div className='w-16 h-16 bg-zinc-100 rounded-xl overflow-hidden'>
                <img
                    src={item?.images[0].url}
                    alt={item.name}
                    className='w-full h-full object-cover'
                />
            </div>

            <div className='flex-1'>
                <h3 className='text-sm font-semibold text-zinc-900'>
                    {item.name}
                </h3>
                <p className='text-xs text-zinc-500'>Color: Space Gray</p>
                <div className='flex justify-between'>
                    <span className='text-xs font-semibold text-zinc-700'>
                        Qty: {item.quantity}
                    </span>
                    <span className='text-xs font-semibold text-zinc-700'>
                        {formatPrice(item.price)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
