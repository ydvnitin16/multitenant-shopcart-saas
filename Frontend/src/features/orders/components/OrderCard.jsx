import StoreOrderCard from "./StoreOrderCard";
import OrderHeader from "./OrderHeader";

const OrderCard = ({ order, cancelStoreOrder, isCancelling }) => {
    return (
        <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden'>
            <OrderHeader order={order} />

            <div className='divide-y'>
                {order.storeOrders.map((storeOrder) => (
                    <StoreOrderCard
                        key={storeOrder._id}
                        storeOrder={storeOrder}
                        parentOrder={order}
                        onCancel={cancelStoreOrder}
                        isCancelling={isCancelling(storeOrder._id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default OrderCard;
