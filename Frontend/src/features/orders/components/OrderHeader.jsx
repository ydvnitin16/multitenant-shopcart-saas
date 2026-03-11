import { formatPrice } from "@/utils/formatPrice";

const OrderHeader = ({ order }) => {
    return (
        <div className='flex flex-wrap gap-6 justify-between items-center px-6 py-5 border-b border-zinc-200 bg-zinc-50'>
            <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide'>
                    Order ID
                </p>
                <p className='font-semibold text-zinc-900'>
                    #{order._id.slice(-8)}
                </p>
            </div>

            <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide'>
                    Total
                </p>
                <p className='font-semibold text-zinc-900'>
                    {formatPrice(order.totalAmount)}
                </p>
            </div>

            <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide'>
                    Payment
                </p>
                <p className='font-semibold text-zinc-900'>
                    {order.paymentMethod}
                </p>
            </div>
        </div>
    );
};
export default OrderHeader;
