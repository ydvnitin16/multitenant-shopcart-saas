import { useState } from "react";
import { useStoreOrders } from "../hooks/useStoreOrders";
import InlineLoader from "@/components/ui/InlineLoader";
import useVendorStoreStore from "@/stores/useVendorStoreStore";
import { formatPrice } from "@/utils/formatPrice";
import OrderDetailsCard from "../components/OrderDetailsCard";

const ManageOrders = () => {
    const { currentStore } = useVendorStoreStore();
    const { orders, loading } = useStoreOrders(currentStore?._id);

    const [selectedOrder, setSelectedOrder] = useState(null);

    if (loading) {
        return (
            <div className='pt-24 flex justify-center'>
                <InlineLoader />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-zinc-50 pt-24 px-6'>
            <div className='max-w-6xl mx-auto space-y-6'>
                <h1 className='text-2xl font-semibold text-zinc-900'>Orders</h1>

                <div className='bg-white border border-zinc-200 rounded-xl overflow-hidden'>
                    <table className='w-full text-sm'>
                        <thead className='bg-zinc-50 text-zinc-600'>
                            <tr>
                                <th className='text-left px-6 py-3'>
                                    Order ID
                                </th>
                                <th className='text-left px-6 py-3'>
                                    Customer
                                </th>
                                <th className='text-left px-6 py-3'>
                                    Payment Mode
                                </th>
                                <th className='text-left px-6 py-3'>
                                    Order Date
                                </th>
                                <th className='text-left px-6 py-3'>Total</th>
                                <th className='text-left px-6 py-3'>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order._id}
                                    onClick={() => setSelectedOrder(order)}
                                    className='border-t hover:bg-zinc-50 cursor-pointer'
                                >
                                    <td className='px-6 py-4 text-blue-500 font-medium'>
                                        #{order._id.slice(-6)}
                                    </td>

                                    <td className='px-6 py-4 font-medium'>
                                        {order.address?.name}
                                    </td>

                                    <td className='px-6 py-4 font-medium'>
                                        {order.parentOrder?.paymentMethod}
                                    </td>

                                    <td className='px-6 py-4'>
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className='px-6 py-4 font-medium'>
                                        {formatPrice(order.totalAmount)}
                                    </td>
                                    <td className='px-6 py-4 font-medium'>
                                        {order.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailsCard
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
};

export default ManageOrders;
