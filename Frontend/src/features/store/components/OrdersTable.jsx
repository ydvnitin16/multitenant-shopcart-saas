import Badge from "@/components/ui/Badge";
import { formatPrice } from "@/utils/formatPrice";
import React from "react";

const OrdersTable = ({ orders, setSelectedOrderId }) => {
    return (
        <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
                <thead className='bg-zinc-50 text-zinc-600'>
                    <tr>
                        <th className='text-left px-6 py-4'>Order ID</th>
                        <th className='text-left px-6 py-4'>Customer</th>
                        <th className='text-left px-6 py-4'>Payment</th>
                        <th className='text-left px-6 py-4'>Date</th>
                        <th className='text-left px-6 py-4'>Total</th>
                        <th className='text-left px-6 py-4'>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => {
                        const variant =
                            order.status === "PENDING"
                                ? "red"
                                : order.status === "DELIVERED"
                                  ? "green"
                                  : order.status === "CANCELLED"
                                    ? "purple"
                                    : "blue";

                        return (
                            <tr
                                key={order._id}
                                onClick={() => setSelectedOrderId(order._id)}
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
                                    {order.parentOrder?.paymentMethod}
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
                                    <Badge
                                        content={order.status}
                                        variant={variant}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;
