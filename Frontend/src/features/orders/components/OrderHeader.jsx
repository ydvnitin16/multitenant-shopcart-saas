import Button from "@/components/ui/Button";
import { formatPrice } from "@/utils/formatPrice";
import useCartStore from "@/stores/useCartStore";
import { useNavigate } from "react-router-dom";

const PAYMENT_STATUS_STYLES = {
    PENDING: "bg-amber-100 text-amber-700",
    PAID: "bg-emerald-100 text-emerald-700",
    FAILED: "bg-rose-100 text-rose-700",
    CANCELLED: "bg-zinc-200 text-zinc-700",
};

const PAYMENT_STATUS_LABELS = {
    PENDING: "Payment Pending",
    PAID: "Paid",
    FAILED: "Payment Failed",
    CANCELLED: "Payment Cancelled",
};

const OrderHeader = ({ order }) => {
    const navigate = useNavigate();
    const setCart = useCartStore((state) => state.setCart);
    const showStripePaymentStatus = order.paymentMethod === "CARD";
    const paymentStatusClass =
        PAYMENT_STATUS_STYLES[order.paymentStatus] ||
        "bg-zinc-100 text-zinc-700";
    const paymentStatusLabel =
        PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus;
    const showRetryAction =
        order.paymentMethod === "CARD" &&
        ["FAILED", "CANCELLED"].includes(order.paymentStatus);
    const unpaidMessage =
        order.paymentStatus === "FAILED"
            ? "Payment failed. This order is unpaid and stock has already been restored."
            : "Payment was cancelled. This order is unpaid and stock has already been restored.";

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

            {showStripePaymentStatus && (
                <div className='flex items-center gap-3 flex-wrap justify-end'>
                    <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${paymentStatusClass}`}
                    >
                        {paymentStatusLabel}
                    </span>

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

            {showRetryAction && (
                <div className='w-full'>
                    <p className='text-xs text-rose-700'>{unpaidMessage}</p>
                </div>
            )}
        </div>
    );
};
export default OrderHeader;
