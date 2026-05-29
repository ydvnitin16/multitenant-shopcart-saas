import { useEffect, useState } from "react";
import { useStoreOrders } from "../hooks/useStoreOrders";
import InlineLoader from "@/components/ui/InlineLoader";
import useVendorStoreStore from "@/stores/useVendorStoreStore";
import { formatPrice } from "@/utils/formatPrice";
import OrderDetailsCard from "../components/OrderDetailsCard";
import StatsCard from "@/components/ui/StatsCard";
import OrdersTable from "../components/OrdersTable";
import { useParams, useSearchParams } from "react-router-dom";
import Pagination from "@/components/ui/Pagination";

const statsCard = (stats) => [
    {
        title: "Today Orders",
        value: stats?.totalOrders || 0,
    },
    {
        title: "Pending Orders",
        value: stats?.pendingOrders || 0,
    },
    {
        title: "Delivered Today",
        value: stats?.deliveredToday || 0,
    },
    {
        title: "Today's Revenue",
        value: formatPrice(stats?.revenueToday || 0),
    },
];

const ManageOrders = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page"));
    const { storeSlug } = useParams();
    const { stores } = useVendorStoreStore();
    const currentStore = stores.find((s) => s.slug == storeSlug) || null;
    const {
        orders,
        stats,
        loading,
        pagination,
        updateOrderStatus,
        isUpdating,
    } = useStoreOrders({ storeId: currentStore?._id, page, limit: 5 });

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const selectedOrder =
        orders.find((order) => order._id === selectedOrderId) || null;

    useEffect(() => {
        if (pagination?.page !== page) {
            searchParams.set("page", pagination?.page);
            setSearchParams(searchParams);
        }
    }, [pagination?.page]);

    function setPage(newPage) {
        setSearchParams({
            page: String(newPage),
        });
    }

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
                    {statsCard(stats).map((item, idx) => (
                        <StatsCard
                            key={idx}
                            title={item.title}
                            value={item.value}
                        />
                    ))}
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

                    <OrdersTable
                        setSelectedOrderId={setSelectedOrderId}
                        orders={orders}
                    />
                    <Pagination
                        onPrev={() => setPage(page - 1)}
                        onNext={() => setPage(page + 1)}
                        currentPage={pagination?.page}
                        totalPages={pagination?.pages}
                    />
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
