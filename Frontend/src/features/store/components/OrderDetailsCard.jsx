import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import {
    Mail,
    MapPin,
    Phone,
    UserRound,
    CreditCard,
    CalendarDays,
} from "lucide-react";

const OrderDetailsCard = ({
    order,
    onClose,
    updateOrderStatus,
    isUpdating,
}) => {
    const address = order.address;
    const parentOrder = order.parentOrder;

    if (!address) return null;

    const handleStatusChange = (e) => {
        updateOrderStatus(order._id, e.target.value);
    };

    return (
        <div className=' fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl shadow-xl border border-zinc-100 max-w-md w-full p-6 space-y-5'>
                {/* Header */}
                <div className='text-center'>
                    <h2 className='text-lg font-semibold text-zinc-900'>
                        Order Details
                    </h2>
                    <p className='text-xs text-zinc-500 mt-1'>
                        #{order._id.slice(-6)}
                    </p>
                </div>

                {/* Customer */}
                <div className='space-y-2 text-sm'>
                    <h3 className='font-medium text-zinc-900'>
                        Customer Details
                    </h3>

                    <p className='flex gap-2 items-center text-zinc-700'>
                        <UserRound size={15} className='text-zinc-400' />
                        {address.name}
                    </p>

                    <p className='flex gap-2 items-center text-zinc-700'>
                        <Mail size={15} className='text-zinc-400' />
                        {address.email}
                    </p>

                    <p className='flex gap-2 items-center text-zinc-700'>
                        <Phone size={15} className='text-zinc-400' />
                        {address.phone}
                    </p>

                    <p className='flex gap-2 items-start text-zinc-700'>
                        <MapPin size={15} className='text-zinc-400 mt-0.5' />
                        <span>
                            {address.street}, {address.city}, {address.state},{" "}
                            {address.country} {address.zipCode}
                        </span>
                    </p>
                </div>

                {/* Products */}
                <div className='space-y-3'>
                    <h3 className='font-medium text-sm text-zinc-900'>
                        Products
                    </h3>

                    {order.items.map((item) => (
                        <div
                            key={item._id}
                            className='flex items-center gap-3 border border-zinc-100 rounded-xl p-2.5'
                        >
                            <img
                                src={
                                    item.product?.images?.[0]?.url ||
                                    item.productImageSnapshot
                                }
                                alt=''
                                className='w-12 h-12 rounded-lg object-cover'
                            />

                            <div className='flex-1 text-sm'>
                                <p className='font-medium text-zinc-800'>
                                    {item.product?.name ||
                                        item.productNameSnapshot}
                                </p>

                                <p className='text-zinc-500 text-xs'>
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <span className='text-sm font-medium text-zinc-800'>
                                {formatPrice(item.price)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className='border-t border-zinc-100 pt-4 space-y-2 text-sm text-zinc-700'>
                    <p className='flex gap-2 items-center'>
                        <CreditCard size={15} className='text-zinc-400' />
                        {parentOrder?.paymentMethod}
                    </p>

                    <p>
                        Paid:{" "}
                        <span className='font-medium'>
                            {parentOrder?.isPaid ? "Yes" : "No"}
                        </span>
                    </p>

                    <p>
                        Status:{" "}
                        <span className='font-medium'>{order.status}</span>
                    </p>

                    <p className='flex gap-2 items-center'>
                        <CalendarDays size={15} className='text-zinc-400' />
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Update Status */}
                {order.status !== "CANCELLED" && (
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-900'>
                            Update Status
                        </label>

                        <select
                            value={order.status}
                            onChange={handleStatusChange}
                            disabled={isUpdating}
                            className='w-full h-11 px-3 rounded-xl border border-zinc-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500'
                        >
                            <option value='PENDING'>Pending</option>
                            <option value='SHIPPED'>Shipped</option>
                            <option value='DELIVERED'>Delivered</option>
                            <option value='CANCELLED'>Cancelled</option>
                        </select>
                    </div>
                )}

                {/* Footer */}
                <div className='flex justify-end pt-1'>
                    <Button variant='secondary' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsCard;
