import Button from "@/components/ui/Button";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItems from "./OrderItems";

const StoreOrderCard = ({
    storeOrder,
    parentOrder,
    onCancel,
    isCancelling,
}) => {
    const paymentPending =
        parentOrder?.paymentMethod === "CARD" &&
        parentOrder?.paymentStatus === "PENDING";
    const canCancel =
        !paymentPending &&
        storeOrder.status !== "DELIVERED" &&
        storeOrder.status !== "CANCELLED";

    return (
        <div className='px-6 py-5 space-y-4 border-zinc-100'>
            <div className='flex items-center justify-between'>
                <div>
                    <p className='font-semibold text-zinc-900'>
                        {storeOrder.store.name}
                    </p>

                    <p className='text-xs text-zinc-500'>
                        Shipment ID #{storeOrder._id.slice(-6)}
                    </p>
                </div>

                <div className='flex items-center gap-3'>
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                            storeOrder.isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                    >
                        {storeOrder.isPaid ? "Paid" : "Unpaid"}
                    </span>
                    <OrderStatusBadge status={storeOrder.status} />
                </div>
            </div>

            <OrderItems items={storeOrder.items} />

            {paymentPending && (
                <p className='text-xs text-amber-700'>
                    Payment is still pending in Stripe. If the payment is
                    cancelled or fails, stock will be restored automatically.
                </p>
            )}

            {canCancel && (
                <div className='flex justify-end'>
                    <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => onCancel(storeOrder._id)}
                        disabled={isCancelling}
                    >
                        {isCancelling ? "Cancelling..." : "Cancel Order"}
                    </Button>
                </div>
            )}
        </div>
    );
};
export default StoreOrderCard;
