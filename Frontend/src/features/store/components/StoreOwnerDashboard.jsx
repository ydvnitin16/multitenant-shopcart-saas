import InlineLoader from "@/components/ui/InlineLoader";
import { formatPrice } from "@/utils/formatPrice";
import {
    AlertTriangle,
    IndianRupee,
    Package,
    ShoppingCart,
    Store,
    Users,
} from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import useStoreDashboard from "../hooks/useStoreDashboard";

const statCards = (stats) => [
    {
        title: "Total Revenue",
        value: formatPrice(stats?.totalRevenue || 0),
        meta: `${formatPrice(stats?.revenueToday || 0)} earned today`,
        icon: IndianRupee,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        title: "Orders",
        value: `${stats?.totalOrders || 0}`,
        meta: `${stats?.pendingOrders || 0} pending orders`,
        icon: ShoppingCart,
        color: "text-sky-600",
        bg: "bg-sky-50",
    },
    {
        title: "Products",
        value: `${stats?.totalProducts || 0}`,
        meta: `${stats?.lowStockCount || 0} low stock, ${stats?.outOfStockCount || 0} out of stock`,
        icon: Package,
        color: "text-violet-600",
        bg: "bg-violet-50",
    },
    {
        title: "Customers",
        value: `${stats?.totalCustomers || 0}`,
        meta: `${stats?.totalUnitsSold || 0} items delivered`,
        icon: Users,
        color: "text-pink-600",
        bg: "bg-pink-50",
    },
];

const getBadge = (status) => {
    if (status === "PENDING") return "bg-yellow-50 text-yellow-700";
    if (status === "SHIPPED") return "bg-sky-50 text-sky-700";
    if (status === "DELIVERED") return "bg-emerald-50 text-emerald-700";
    return "bg-rose-50 text-rose-700";
};

export default function StoreOwnerDashboard() {
    const { storeSlug } = useParams();
    const { dashboard, loading, error } = useStoreDashboard(storeSlug);

    if (loading) {
        return (
            <div className='pt-24 flex justify-center'>
                <InlineLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-zinc-50 px-6 py-10'>
                <div className='mx-auto max-w-4xl rounded-3xl border border-rose-200 bg-white p-8 text-center'>
                    <h1 className='text-2xl font-semibold text-zinc-900'>
                        Dashboard unavailable
                    </h1>
                    <p className='mt-2 text-sm text-zinc-500'>{error}</p>
                </div>
            </div>
        );
    }

    const store = dashboard?.store;
    const stats = dashboard?.stats;
    const sales = dashboard?.salesLast7Days || [];
    const recentOrders = dashboard?.recentOrders || [];
    const lowStockProducts = dashboard?.lowStockProducts || [];
    const maxRevenue = Math.max(...sales.map((item) => item.revenue), 1);

    return (
        <div className='min-h-screen bg-zinc-50 text-zinc-900'>
            <header className='border-b border-zinc-200 px-6 py-5 flex items-center justify-between gap-4'>
                <div>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        {store?.name || "Store Dashboard"}
                    </h1>

                    <p className='mt-1 text-sm text-zinc-500'>
                        {store?.email || "Manage your store operations from one place."}
                    </p>
                </div>

                <div className='flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3'>
                    <div className='rounded-xl bg-zinc-100 p-2'>
                        <Store className='text-zinc-700' size={18} />
                    </div>

                    <div className='text-right'>
                        <p className='text-xs uppercase tracking-wide text-zinc-500'>
                            Store Status
                        </p>
                        <p className='text-sm font-semibold text-zinc-900'>
                            {store?.status || "APPROVED"}
                        </p>
                    </div>
                </div>
            </header>

            <main className='p-6 space-y-6'>
                <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
                    {statCards(stats).map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className='rounded-2xl border border-zinc-200 bg-white p-5'
                            >
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <p className='text-sm text-zinc-500'>
                                            {item.title}
                                        </p>

                                        <h3 className='mt-2 text-2xl font-bold'>
                                            {item.value}
                                        </h3>

                                        <p className='mt-2 text-sm text-zinc-500'>
                                            {item.meta}
                                        </p>
                                    </div>

                                    <div className={`rounded-xl p-3 ${item.bg}`}>
                                        <Icon size={22} className={item.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>

                <section className='grid grid-cols-1 gap-5 xl:grid-cols-3'>
                    <div className='rounded-2xl border border-zinc-200 bg-white p-5 xl:col-span-2'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h3 className='text-lg font-semibold'>
                                    Sales Analytics
                                </h3>

                                <p className='text-sm text-zinc-500'>
                                    Delivered revenue in the last 7 days
                                </p>
                            </div>

                            <p className='text-sm font-medium text-zinc-500'>
                                Avg order value {formatPrice(stats?.avgOrderValue || 0)}
                            </p>
                        </div>

                        <div className='mt-8 grid h-64 grid-cols-7 items-end gap-3'>
                            {sales.map((item) => (
                                <div key={item.date} className='flex h-full flex-col justify-end gap-3'>
                                    <div
                                        className='rounded-t-xl bg-gradient-to-t from-violet-500 to-sky-400'
                                        style={{
                                            height: `${Math.max(
                                                (item.revenue / maxRevenue) * 100,
                                                item.revenue > 0 ? 12 : 4,
                                            )}%`,
                                        }}
                                        title={`${item.label}: ${formatPrice(item.revenue)} from ${item.orders} orders`}
                                    />
                                    <div className='text-center'>
                                        <p className='text-xs font-medium text-zinc-700'>
                                            {item.label}
                                        </p>
                                        <p className='text-[11px] text-zinc-500'>
                                            {item.orders} orders
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='space-y-5'>
                        <div className='rounded-2xl border border-zinc-200 bg-white p-5'>
                            <p className='text-sm text-zinc-500'>Order Flow</p>
                            <h3 className='mt-2 text-3xl font-bold'>
                                {stats?.todayOrders || 0}
                            </h3>
                            <p className='mt-2 text-sm text-zinc-500'>
                                {stats?.shippedOrders || 0} shipped, {stats?.deliveredOrders || 0} delivered overall
                            </p>
                        </div>

                        <div className='rounded-2xl border border-zinc-200 bg-white p-5'>
                            <p className='text-sm text-zinc-500'>Store Contact</p>
                            <h3 className='mt-2 text-lg font-semibold text-zinc-900'>
                                {store?.contact || "Not available"}
                            </h3>
                            <p className='mt-2 text-sm text-zinc-500'>
                                {store?.address || "No address added"}
                            </p>
                        </div>
                    </div>
                </section>

                <section className='grid grid-cols-1 gap-5 xl:grid-cols-3'>
                    <div className='rounded-2xl border border-zinc-200 bg-white p-5 xl:col-span-2'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-lg font-semibold'>Recent Orders</h3>
                            <Link
                                to={`/store/${storeSlug}/manage-orders`}
                                className='text-sm font-medium text-blue-600 hover:text-blue-700'
                            >
                                View all
                            </Link>
                        </div>

                        <div className='overflow-x-auto'>
                            <table className='w-full text-sm'>
                                <thead>
                                    <tr className='border-b border-zinc-200 text-zinc-500'>
                                        <th className='py-3 text-left'>Order</th>
                                        <th className='py-3 text-left'>Customer</th>
                                        <th className='py-3 text-left'>Items</th>
                                        <th className='py-3 text-left'>Amount</th>
                                        <th className='py-3 text-left'>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentOrders.length ? (
                                        recentOrders.map((order) => (
                                            <tr
                                                key={order._id}
                                                className='border-b border-zinc-100'
                                            >
                                                <td className='py-4 font-medium text-zinc-900'>
                                                    #{order._id.slice(-6)}
                                                </td>
                                                <td className='py-4'>
                                                    <p className='font-medium text-zinc-800'>
                                                        {order.address?.name || "Customer"}
                                                    </p>
                                                    <p className='text-xs text-zinc-500'>
                                                        {order.address?.email || "No email"}
                                                    </p>
                                                </td>
                                                <td className='py-4 text-zinc-600'>
                                                    {order.itemCount || 0}
                                                </td>
                                                <td className='py-4 font-semibold text-zinc-800'>
                                                    {formatPrice(order.totalAmount)}
                                                </td>
                                                <td className='py-4'>
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs ${getBadge(order.status)}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan='5'
                                                className='py-8 text-center text-sm text-zinc-500'
                                            >
                                                No orders yet for this store.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='rounded-2xl border border-zinc-200 bg-white p-5'>
                        <div className='mb-4 flex items-center gap-2'>
                            <AlertTriangle className='text-yellow-600' />
                            <h3 className='text-lg font-semibold'>Low Stock</h3>
                        </div>

                        <div className='space-y-3'>
                            {lowStockProducts.length ? (
                                lowStockProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className='rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm'
                                    >
                                        <p className='font-medium text-zinc-900'>
                                            {product.name}
                                        </p>
                                        <p className='mt-1 text-zinc-500'>
                                            {product.stock} left in stock
                                        </p>
                                        <p className='mt-1 font-medium text-zinc-700'>
                                            {formatPrice(product.price)}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className='rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500'>
                                    All products are stocked well right now.
                                </div>
                            )}
                        </div>

                        <Link
                            to={`/store/${storeSlug}/manage-products`}
                            className='mt-5 block w-full rounded-xl bg-zinc-900 py-3 text-center font-medium text-white transition hover:opacity-90'
                        >
                            Manage Products
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
