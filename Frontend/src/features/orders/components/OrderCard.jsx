import OrderHeader from "./OrderHeader";
import StoreOrderCard from "./StoreOrderCard";

const OrderCard = ({ order }) => {
    return (
        <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden'>
            <OrderHeader order={order} />

            <div className='divide-y'>
                {order.storeOrders.map((storeOrder) => (
                    <StoreOrderCard
                        key={storeOrder._id}
                        storeOrder={storeOrder}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrderCard;
