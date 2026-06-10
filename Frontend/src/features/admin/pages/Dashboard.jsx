import React from "react";
import { formatPrice } from "@/utils/formatPrice";
import {
    Store,
    Package,
    ShoppingCart,
    IndianRupee,
    Users,
    CreditCard,
} from "lucide-react";
import StatsCard from "@/components/ui/StatsCard";
import Loader from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import InlineLoader from "@/components/ui/InlineLoader";
import useFetch from "@/hooks/useFetch";
import {
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import PageShell from "@/components/layout/PageShell";

const statCards = (stats) => [
    {
        title: "Revenue",
        value: formatPrice(stats?.totalRevenue || 0),
        meta: `${formatPrice(stats?.monthlyRevenue || 0)} this month`,
        icon: IndianRupee,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        title: "Subscription Revenue",
        value: formatPrice(stats?.subscriptionRevenue || 0),
        meta: "Recorded Stripe subscription payments",
        icon: CreditCard,
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        title: "Products",
        value: stats?.totalProducts || 0,
        meta: "Across all stores",
        icon: Package,
        color: "text-violet-600",
        bg: "bg-violet-50",
    },
    {
        title: "Orders",
        value: stats?.totalOrders || 0,
        meta: `${stats?.todayOrders || 0} today`,
        icon: ShoppingCart,
        color: "text-pink-600",
        bg: "bg-pink-50",
    },
    {
        title: "Total Stores",
        value: stats?.totalStores || 0,
        meta: `${stats?.activeStores || 0} active stores`,
        icon: Store,
        color: "text-sky-600",
        bg: "bg-sky-50",
    },
    {
        title: "Customers",
        value: stats?.totalCustomers || 0,
        meta: "Platform users",
        icon: Users,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
];

export default function AdminDashboard() {
    const { data, loading, error, reFetch } = useFetch("/admin/stats");
    const stats = data?.stats;

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Something went wrong</p>;
    }

    return (
        <PageShell
            title='Admin Dashboard'
            description='Monitor and manage platform performance'
            actions={
                <Button onClick={reFetch}>
                    {loading ? <InlineLoader size='sm' /> : "Refresh"}
                </Button>
            }
        >
            <main className='py-6 space-y-6 border-t border-zinc-300'>
                {/* Stats card */}
                <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'>
                    {statCards(stats).map((item) => {
                        const Icon = item.icon;

                        return (
                            <StatsCard
                                key={item.title}
                                title={item.title}
                                value={item.value}
                                meta={item.meta}
                                color={item.color}
                                bg={item.bg}
                                Icon={Icon}
                            />
                        );
                    })}
                </section>

                {/* Charts */}
                <section className='grid grid-cols-1 gap-5 xl:grid-cols-3'>
                    {/* Revenue chart */}
                    <div className='rounded-2xl border border-zinc-200 bg-white py-5 sm:px-5 px-2 xl:col-span-2'>
                        <div>
                            <h3 className='text-lg font-semibold'>
                                Revenue Analytics
                            </h3>

                            <p className='text-sm text-zinc-500 mb-5'>
                                Subscription revenue overview
                            </p>
                        </div>

                        {stats?.revenueLast7Days ? (
                            <ResponsiveContainer height={400} width={"100%"}>
                                <LineChart data={stats.revenueLast7Days}>
                                    <XAxis dataKey='label' />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type='monotone'
                                        dataKey='revenue'
                                        stroke='#8884d8'
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className='mt-8 h-72 rounded-2xl bg-zinc-100 flex items-center justify-center'>
                                <p className='text-zinc-400'>
                                    Can't Load Revenue Chart
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Subscription stats */}
                    <div className='rounded-2xl border border-zinc-200 bg-white p-5'>
                        <h3 className='text-lg font-semibold'>
                            Active Subscription Plans
                        </h3>

                        <div className='mt-6 space-y-5'>
                            {stats?.subscriptions &&
                                Object.entries(stats.subscriptions).map(
                                    ([plan, value]) => (
                                        <div key={plan}>
                                            <div className='mb-2 flex justify-between'>
                                                <p className='capitalize font-medium'>
                                                    {plan}
                                                </p>

                                                <p className='text-zinc-500'>
                                                    {value}
                                                </p>
                                            </div>

                                            <div className='h-2 rounded-full bg-zinc-100'>
                                                <div
                                                    className='h-2 rounded-full bg-zinc-900'
                                                    style={{
                                                        width: `${value * 4}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ),
                                )}
                        </div>
                    </div>
                </section>
            </main>
        </PageShell>
    );
}
