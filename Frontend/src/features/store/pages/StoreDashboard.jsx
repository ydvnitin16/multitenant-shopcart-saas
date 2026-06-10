import React, { useState } from "react";
import { formatPrice } from "@/utils/formatPrice";
import {
    AlertTriangle,
    IndianRupee,
    Package,
    ShoppingCart,
    Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import StatsCard from "@/components/ui/StatsCard";
import PageShell from "@/components/layout/PageShell";
import Button from "@/components/ui/Button";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import Loader from "@/components/ui/Loader";
import useVendorStoreStore from "@/stores/useVendorStoreStore";
import Badge from "@/components/ui/Badge";
import {
    cancelSubscription,
    subscriptionBillingCheckout,
    upgradeCurrentSubscription,
} from "../services/subscription.api";
import SubscriptionModal from "../components/SubscriptionModal";
import toast from "react-hot-toast";
import useFetch from "@/hooks/useFetch";

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
        meta: `${stats?.todayOrders || 0} today orders`,
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
        meta: `Average ${formatPrice(stats?.avgOrderValue || 0)}/Orders`,
        icon: Users,
        color: "text-pink-600",
        bg: "bg-pink-50",
    },
];

const StoreDashboard = () => {
    const { storeSlug } = useParams();
    const { stores } = useVendorStoreStore();
    const currentStore = stores.find((s) => s.slug == storeSlug);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] =
        useState(false);
    const [loadingPlan, setLoadingPlan] = useState(null);

    const {
        data: dashboard,
        loading,
        error,
        reFetch: refetch,
    } = useFetch(
        currentStore?._id ? `/stores/${currentStore._id}/stats` : null,
    );

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className='min-h-screen bg-zinc-50 px-6 py-10'>
                <div className='mx-auto max-w-4xl rounded-3xl border border-rose-200 bg-white p-8 text-center'>
                    <h1 className='text-2xl font-semibold text-zinc-900'>
                        Dashboard unavailable
                    </h1>
                    <p className='mt-2 text-sm text-zinc-500'>
                        {error.message}
                    </p>
                </div>
            </div>
        );
    }

    const store = dashboard?.store;
    const displayStore = store || currentStore;
    const stats = dashboard?.stats;
    const sales = dashboard?.salesLast7Days || [];
    const lowStockProducts = dashboard?.lowStockProducts || [];
    const sevenDaysRevenue = sales.reduce((acc, curr) => acc + curr.revenue, 0);

    const handlePlanCheckout = async (plan) => {
        try {
            setLoadingPlan(plan);
            const data = await subscriptionBillingCheckout(
                displayStore?._id,
                plan,
            );
            window.location.href = data.url;
        } catch (err) {
            toast.error(err.message || "Unable to start subscription checkout");
            setLoadingPlan(null);
        }
    };

    const handleCancelSubscription = async () => {
        try {
            const data = await cancelSubscription(displayStore._id);
            toast.success(data.message);
        } catch (err) {
            toast.error(err.message || "Unable to cancel subscription");
        }
    };

    const handleUpgradeCurrentSubscription = async () => {
        try {
            const data = await upgradeCurrentSubscription(
                displayStore._id,
                "PRO",
            );
            toast.success(data.message || "Upgraded to PRO");
        } catch (err) {
            toast.error(err.message || "Failed to process");
        }
    };

    return (
        <>
            <PageShell
                title={displayStore?.name || "Store Dashboard"}
                description={
                    displayStore?.email ||
                    "Manage your store operations from one place."
                }
                actions={
                    <>
                        <div className='flex items-center justify-between gap-2 w-full px-6 py-4 border border-zinc-300 rounded-2xl bg-white'>
                            <Badge
                                content={`${displayStore?.subscriptionPlan || "FREE"} plan`}
                                variant={
                                    displayStore?.subscriptionStatus ===
                                    "ACTIVE"
                                        ? "green"
                                        : "yellow"
                                }
                                className={"rounded-md"}
                            />
                            <Button
                                onClick={() => setIsSubscriptionModalOpen(true)}
                                size='sm'
                                variant='secondary'
                            >
                                Upgrade Plan
                            </Button>
                            <Button size='sm' onClick={refetch}>
                                Refresh
                            </Button>
                        </div>
                    </>
                }
            >
                <main className='p-6 space-y-6'>
                    <section className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
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

                    <section className='grid grid-cols-1 gap-5 xl:grid-cols-3'>
                        {/* Revenue chart */}
                        <div className='rounded-2xl border border-zinc-200 bg-white p-5 xl:col-span-2'>
                            <div className='flex justify-between'>
                                <div>
                                    <h3 className='text-lg font-semibold'>
                                        Sales Analytics
                                    </h3>

                                    <p className='text-sm text-zinc-500 mb-5'>
                                        Delivered revenue in the last 7 days
                                    </p>
                                </div>
                                <div className='font-medium italic'>
                                    7 Days Revenue: ₹{sevenDaysRevenue}
                                </div>
                            </div>

                            {sales ? (
                                <ResponsiveContainer
                                    height={400}
                                    width={"100%"}
                                >
                                    <BarChart
                                        data={sales}
                                        margin={{
                                            top: 20,
                                            right: 20,
                                            bottom: 5,
                                            left: 20,
                                        }}
                                    >
                                        <XAxis dataKey='label' />
                                        <YAxis />

                                        <Tooltip />

                                        <Bar dataKey='orders' fill='#8884d8' />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className='mt-8 h-72 rounded-2xl bg-zinc-100 flex items-center justify-center'>
                                    <p className='text-zinc-400'>
                                        Can't Load Sales Chart
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className='rounded-2xl border border-zinc-200 bg-white p-5'>
                            <div className='mb-4 flex items-center gap-2'>
                                <AlertTriangle className='text-yellow-600' />
                                <h3 className='text-lg font-semibold'>
                                    Low Stock
                                </h3>
                            </div>

                            <div className='space-y-3'>
                                {lowStockProducts.length ? (
                                    lowStockProducts.map((product) => (
                                        <div
                                            key={product._id}
                                            className='flex flex-row items-center rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm'
                                        >
                                            <div className='h-20 w-20 '>
                                                <img
                                                    src={product.images[0].url}
                                                />
                                            </div>

                                            <div>
                                                <p className='font-medium text-zinc-900'>
                                                    {product.name}
                                                </p>
                                                <p className='mt-1 text-zinc-500'>
                                                    {product.stock > 0
                                                        ? `${product.stock} Left in stock`
                                                        : `Out of Stock`}
                                                </p>
                                                <p className='mt-1 font-medium text-zinc-700'>
                                                    {formatPrice(product.price)}
                                                </p>
                                            </div>
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
            </PageShell>
            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={() => setIsSubscriptionModalOpen(false)}
                onChoosePlan={handlePlanCheckout}
                loadingPlan={loadingPlan}
                currentPlan={displayStore?.subscriptionPlan}
                cancelSubscription={handleCancelSubscription}
                upgradeCurrentSubscription={handleUpgradeCurrentSubscription}
            />
        </>
    );
};

export default StoreDashboard;
