import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import useCartStore from "@/stores/useCartStore";
import { useNavigate } from "react-router-dom";
import Badge from "@/components/ui/Badge";

const PAYMENT_STATUS_STYLES = {
    PENDING: "yellow",
    PAID: "green",
    FAILED: "red",
    CANCELLED: "blue",
};

const PAYMENT_STATUS_LABELS = {
    PENDING: "Payment Pending",
    PAID: "Payment Paid",
    FAILED: "Payment Failed",
    CANCELLED: "Payment Cancelled",
};

const OrderHeader = ({ order }) => {
    const navigate = useNavigate();
    const setCart = useCartStore((state) => state.setCart);

    const paymentStatusClass =
        PAYMENT_STATUS_STYLES[order.paymentStatus] || "grey";

    const paymentStatusLabel =
        PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus;

    const showRetryAction =
        order.paymentMethod === "CARD" &&
        ["FAILED", "CANCELLED"].includes(order.paymentStatus);

    const handleOrderAgain = () => {
        const items = order.storeOrders
            .flatMap((storeOrder) => storeOrder.items || [])
            .map((item) => ({
                productId: item.product?._id || item.product?._id?.toString?.(),
                quantity: item.quantity,
            }))
            .filter((item) => item.productId);

        if (!items.length) {
            return;
        }

        setCart(items);
        navigate("/checkout");
    };

    return (
        <div className='flex flex-wrap gap-6 justify-between items-center px-6 py-5 border-b border-zinc-200 bg-zinc-50'>
            <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide'>
                    Order ID
                </p>
                <p className='font-semibold text-zinc-900'>
                    #{order._id.slice(-8)}
                </p>
            </div>

            <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide'>
                    Total
                </p>
                <p className='font-semibold text-zinc-900'>
                    {formatPrice(order.totalAmount)}
                </p>
            </div>

            <div>
                <p className='text-xs text-zinc-500 uppercase tracking-wide'>
                    Payment
                </p>
                <p className='font-semibold text-zinc-900'>
                    {order.paymentMethod}
                </p>
            </div>

            {paymentStatusLabel && (
                <div className='flex items-center gap-3 flex-wrap justify-end'>
                    <Badge
                        content={paymentStatusLabel}
                        variant={paymentStatusClass}
                    />

                    {showRetryAction && (
                        <Button
                            variant='secondary'
                            size='sm'
                            onClick={handleOrderAgain}
                        >
                            Order Again
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
export default OrderHeader;
