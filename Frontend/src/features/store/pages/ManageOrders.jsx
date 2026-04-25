import { useState } from "react";
import { useStoreOrders } from "../hooks/useStoreOrders";
import InlineLoader from "@/components/ui/InlineLoader";
import useVendorStoreStore from "@/stores/useVendorStoreStore";
import { formatPrice } from "@/utils/formatPrice";
import OrderDetailsCard from "../components/OrderDetailsCard";

const ManageOrders = () => {
    const { currentStore } = useVendorStoreStore();
    const { orders, loading, updateOrderStatus, isUpdating } = useStoreOrders(
        currentStore?._id,
    );

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const selectedOrder =
        orders.find((order) => order._id === selectedOrderId) || null;

    if (loading) {
        return (
            <div className='pt-24 flex justify-center'>
                <InlineLoader />
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-zinc-50 pt-1 px-6'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div>
                        <h1 className='text-3xl font-semibold text-zinc-900'>
                            Orders
                        </h1>
                        <p className='text-sm text-zinc-500 mt-1'>
                            Manage and track all incoming store orders.
                        </p>
                    </div>

                    <div className='flex items-center gap-3'>
                        <input
                            type='text'
                            placeholder='Search order...'
                            className='h-11 px-4 rounded-xl border border-zinc-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500'
                        />

                        <select className='h-11 px-4 rounded-xl border border-zinc-200 bg-white text-sm outline-none'>
                            <option>All Status</option>
                            <option>Pending</option>
                            <option>Shipped</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    <div className='bg-white border border-zinc-200 rounded-2xl p-5'>
                        <p className='text-sm text-zinc-500'>Total Orders</p>
                        <h3 className='text-2xl font-semibold mt-2'>
                            {orders.length}
                        </h3>
                    </div>

                    <div className='bg-white border border-zinc-200 rounded-2xl p-5'>
                        <p className='text-sm text-zinc-500'>Pending</p>
                        <h3 className='text-2xl font-semibold mt-2 text-amber-600'>
                            {
                                orders.filter((o) => o.status === "PENDING")
                                    .length
                            }
                        </h3>
                    </div>

                    <div className='bg-white border border-zinc-200 rounded-2xl p-5'>
                        <p className='text-sm text-zinc-500'>Delivered</p>
                        <h3 className='text-2xl font-semibold mt-2 text-emerald-600'>
                            {
                                orders.filter((o) => o.status === "DELIVERED")
                                    .length
                            }
                        </h3>
                    </div>

                    <div className='bg-white border border-zinc-200 rounded-2xl p-5'>
                        <p className='text-sm text-zinc-500'>Revenue</p>
                        <h3 className='text-2xl font-semibold mt-2 text-blue-600'>
                            {formatPrice(
                                orders.reduce(
                                    (acc, item) => acc + item.totalAmount,
                                    0,
                                ),
                            )}
                        </h3>
                    </div>
                </div>

                {/* Orders Table */}
                <div className='bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm'>
                    <div className='px-6 py-4 border-b border-zinc-200 flex items-center justify-between'>
                        <h2 className='font-semibold text-zinc-900'>
                            Recent Orders
                        </h2>

                        <p className='text-sm text-zinc-500'>
                            Showing {orders.length} orders
                        </p>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-zinc-50 text-zinc-600'>
                                <tr>
                                    <th className='text-left px-6 py-4'>
                                        Order ID
                                    </th>
                                    <th className='text-left px-6 py-4'>
                                        Customer
                                    </th>
                                    <th className='text-left px-6 py-4'>
                                        Payment
                                    </th>
                                    <th className='text-left px-6 py-4'>
                                        Date
                                    </th>
                                    <th className='text-left px-6 py-4'>
                                        Total
                                    </th>
                                    <th className='text-left px-6 py-4'>
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => {
                                    const badge =
                                        order.status === "PENDING"
                                            ? "bg-red-50 text-red-700"
                                            : order.status === "DELIVERED"
                                              ? "bg-emerald-50 text-emerald-700"
                                              : order.status === "CANCELLED"
                                                ? "bg-rose-50 text-rose-700"
                                                : "bg-blue-50 text-blue-700";

                                    return (
                                        <tr
                                            key={order._id}
                                            onClick={() =>
                                                setSelectedOrderId(order._id)
                                            }
                                            className='border-t border-zinc-100 hover:bg-zinc-50 cursor-pointer transition'
                                        >
                                            <td className='px-6 py-4 font-semibold text-blue-600'>
                                                #{order._id.slice(-6)}
                                            </td>

                                            <td className='px-6 py-4'>
                                                <div>
                                                    <p className='font-medium text-zinc-800'>
                                                        {order.address?.name}
                                                    </p>
                                                    <p className='text-xs text-zinc-500'>
                                                        {order.address?.email}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className='px-6 py-4 font-medium text-zinc-700'>
                                                {
                                                    order.parentOrder
                                                        ?.paymentMethod
                                                }
                                            </td>

                                            <td className='px-6 py-4 text-zinc-600'>
                                                {new Date(
                                                    order.createdAt,
                                                ).toLocaleDateString()}
                                            </td>

                                            <td className='px-6 py-4 font-semibold text-zinc-800'>
                                                {formatPrice(order.totalAmount)}
                                            </td>

                                            <td className='px-6 py-4'>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${badge}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailsCard
                    order={selectedOrder}
                    onClose={() => setSelectedOrderId(null)}
                    updateOrderStatus={updateOrderStatus}
                    isUpdating={isUpdating(selectedOrder._id)}
                />
            )}
        </div>
    );
};

export default ManageOrders;
