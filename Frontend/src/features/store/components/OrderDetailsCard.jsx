import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";

const OrderDetailsCard = ({ order, onClose }) => {
    const address = order.addressId;

    return (
        <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-xl shadow-lg max-w-md w-full p-6 space-y-5'>
                <h2 className='text-lg font-semibold text-center'>
                    Order Details
                </h2>

                {/* Customer */}
                <div className='space-y-1 text-sm'>
                    <h3 className='font-medium'>Customer Details</h3>

                    <p>Name: {address.name}</p>
                    <p>Email: {address.email}</p>
                    <p>Phone: {address.phone}</p>

                    <p>
                        Address: {address.street}, {address.city},{" "}
                        {address.state}, {address.country} {address.zipCode}
                    </p>
                </div>

                {/* Products */}
                <div className='space-y-3'>
                    <h3 className='font-medium text-sm'>Products</h3>

                    {order.items.map((item) => (
                        <div key={item._id} className='flex items-center gap-3'>
                            <img
                                src={item.productId.images[0].url}
                                className='w-12 h-12 rounded object-cover'
                            />

                            <div className='flex-1 text-sm'>
                                <p className='font-medium'>
                                    {item.productId.name}
                                </p>

                                <p className='text-zinc-500'>
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <span className='text-sm font-medium'>
                                {formatPrice(item.price)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className='border-t pt-3 text-sm space-y-1'>
                    <p>Payment Method: {order.parentOrderId.paymentMethod}</p>

                    <p>Paid: {order.parentOrderId.isPaid ? "Yes" : "No"}</p>

                    <p>Status: {order.status}</p>

                    <p>
                        Order Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>

                <div className='flex justify-end pt-2'>
                    <Button variant='secondary' onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsCard;
