const statusColors = {
    ORDER_PLACED: "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
};

const OrderStatusBadge = ({ status }) => {
    return (
        <span
            className={`text-xs px-3 py-1 rounded-full font-medium
            ${statusColors[status]}`}
        >
            {status.replace("_", " ")}
        </span>
    );
};

export default OrderStatusBadge;
