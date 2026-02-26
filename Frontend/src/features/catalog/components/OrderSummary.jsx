import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import { ArrowRight } from "lucide-react";
import React from "react";

const OrderSummary = ({ products }) => {
    const totalItems = products.length || 0;

    const subTotalAmount = products.reduce(
        (total, product) => total + product.mrp,
        0,
    );
    const totalPayableAmount = products.reduce(
        (total, product) => total + product.price,
        0,
    );
    const discount = subTotalAmount
        ? Math.round(subTotalAmount - totalPayableAmount)
        : 0;

    return (
        <div className='bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 space-y-6 h-fit'>
            <h2 className='text-lg font-semibold text-zinc-900'>
                Order Summary
            </h2>

            <div className='space-y-3 text-sm font-medium'>
                <div className='flex justify-between text-zinc-600'>
                    <span>MRP ({totalItems} items)</span>
                    <span>{formatPrice(subTotalAmount)}</span>
                </div>

                <div className='flex justify-between text-emerald-600'>
                    <span>Discount</span>
                    <span>- {formatPrice(discount)}</span>
                </div>
            </div>

            <div className='border-t border-zinc-200 pt-4 flex justify-between font-semibold text-zinc-900'>
                <span>Total Amount</span>
                <span className='text-lg'>
                    {formatPrice(totalPayableAmount)}
                </span>
            </div>

            <Button className='w-full flex justify-center gap-2'>
                Proceed to Checkout
                <ArrowRight size={16} />
            </Button>

            {/* Promo Code */}
            <div className='space-y-3 pt-4 border-t border-zinc-200'>
                <h3 className='text-xs font-medium text-zinc-500 uppercase'>
                    Promo Code
                </h3>

                <div className='flex gap-2'>
                    <input
                        type='text'
                        placeholder='Enter code'
                        className='flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-400'
                    />
                    <Button variant='secondary' size='sm'>
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
