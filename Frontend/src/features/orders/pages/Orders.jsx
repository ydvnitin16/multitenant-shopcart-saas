import { formatPrice } from "@/utils/formatPrice";
import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/OrderCard";

const Orders = () => {
    const { orders, loading } = useOrders();

    if (loading) {
        return (
            <div className='min-h-screen bg-zinc-50 pt-28 flex justify-center'>
                <p className='text-zinc-600'>Loading your orders...</p>
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

                {orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))}
            </div>
        </div>
    );
};

export default Orders;
