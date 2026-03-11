import { formatPrice } from "@/utils/formatPrice";

const OrderItems = ({ items }) => {
    return (
        <div className='space-y-3'>
            {items.map((item) => (
                <div
                    key={item._id}
                    className='flex items-center gap-4 bg-zinc-50 rounded-xl p-3'
                >
                    <div className='w-16 h-16 rounded-lg overflow-hidden bg-zinc-100'>
                        <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className='w-full h-full object-cover'
                        />
                    </div>

                    <div className='flex-1'>
                        <h3 className='text-sm font-semibold text-zinc-900'>
                            {item.product.name}
                        </h3>

                        <div className='flex justify-between text-xs text-zinc-600 mt-1'>
                            <span>Qty: {item.quantity}</span>
                            <span>{formatPrice(item.price)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderItems;
