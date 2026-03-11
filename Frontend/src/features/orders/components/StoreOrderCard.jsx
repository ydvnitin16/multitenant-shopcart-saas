import OrderStatusBadge from "./OrderStatusBadge";
import OrderItems from "./OrderItems";

const StoreOrderCard = ({ storeOrder }) => {
    return (
        <div className='px-6 py-5 space-y-4'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='font-semibold text-zinc-900'>
                        {storeOrder.store.name}
                    </p>

                    <p className='text-xs text-zinc-500'>
                        Shipment ID #{storeOrder._id.slice(-6)}
                    </p>
                </div>

                <OrderStatusBadge status={storeOrder.status} />
            </div>

            <OrderItems items={storeOrder.items} />
        </div>
    );
};
export default StoreOrderCard;
