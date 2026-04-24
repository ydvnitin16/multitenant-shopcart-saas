import { useState } from "react";
import { placeOrder } from "../services/orders.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const usePlaceOrder = ({ clearCart }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePlaceOrder = async (payload) => {
        try {
            setLoading(true);
            setError(null);

            const data = await placeOrder(payload);
            if (payload.paymentMethod === "COD") {
                clearCart?.();
                navigate("/orders");
            }

        } catch (err) {
            const message = err?.message || "Something went wrong";
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handlePlaceOrder,
    };
};
