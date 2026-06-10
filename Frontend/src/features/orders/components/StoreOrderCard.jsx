import Button from "@/components/ui/Button";
import OrderItems from "./OrderItems";
import Badge from "@/components/ui/Badge";

const statusColors = {
    PENDING: "yellow",
    SHIPPED: "blue",
    DELIVERED: "green",
    CANCELLED: "red",
};

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
        storeOrder.status !== "CANCELLED" &&
        parentOrder?.paymentMethod !== "CARD";

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

                {
                    <div className='flex items-center gap-3'>
                        {!parentOrder.isPaid && (
                            <Badge
                                content={storeOrder.isPaid ? "Paid" : "Unpaid"}
                                variant={storeOrder.isPaid ? "green" : "yellow"}
                            />
                        )}

                        <Badge
                            content={storeOrder.status}
                            variant={statusColors[storeOrder.status]}
                        />
                    </div>
                }
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
