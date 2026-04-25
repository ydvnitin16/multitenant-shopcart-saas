import OrderHeader from "./OrderHeader";
import StoreOrderCard from "./StoreOrderCard";

const OrderCard = ({ order, cancelStoreOrder, isCancelling }) => {
    return (
        <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden'>
            <OrderHeader order={order} />

            <div className='divide-y'>
                {order.storeOrders.map((storeOrder) => (
                    <StoreOrderCard
                        key={storeOrder._id}
                        storeOrder={storeOrder}
                        onCancel={cancelStoreOrder}
                        isCancelling={isCancelling(storeOrder._id)}
                    />
                ))}
                <div className='px-6 py-4 border-t border-zinc-200 bg-emerald-50 text-sm text-emerald-700'>
                    Note* Items from different vendors may be shipped
                    separately. In case of Cash on Delivery pay only for the
                    items that you have recieved.
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
