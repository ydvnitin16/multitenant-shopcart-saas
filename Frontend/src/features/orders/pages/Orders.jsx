import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/OrderCard";

const Orders = () => {
    const { orders, loading, error, cancelStoreOrder, isCancelling } =
        useOrders();

    if (loading) {
        return (
            <div className='min-h-screen bg-zinc-50 pt-28 flex justify-center'>
                <p className='text-zinc-600'>Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen bg-zinc-50 pt-28 flex items-center justify-center text-red-600'>
                {error}
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className='min-h-screen bg-zinc-50 pt-28 flex flex-col items-center gap-3'>
                <h2 className='text-lg font-semibold text-zinc-900'>
                    No Orders Yet
                </h2>
                <p className='text-sm text-zinc-500'>
                    Your placed orders will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-zinc-50 pt-28 px-6'>
            <div className='max-w-6xl mx-auto space-y-8'>
                <h1 className='text-2xl font-semibold text-zinc-900'>
                    My Orders
                </h1>

                <div className='px-6 py-4 border rounded-2xl border-emerald-200 bg-emerald-50 text-sm text-emerald-700'>
                    Note: Items from different vendors may be shipped
                    separately. In case of Cash on Delivery pay only for the
                    items that you have recieved.
                </div>

                {orders.map((order) => (
                    <OrderCard
                        key={order._id}
                        order={order}
                        cancelStoreOrder={cancelStoreOrder}
                        isCancelling={isCancelling}
                    />
                ))}
            </div>
        </div>
    );
};

export default Orders;
