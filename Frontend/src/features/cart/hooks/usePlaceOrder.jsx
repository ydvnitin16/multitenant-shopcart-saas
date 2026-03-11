import { useState } from "react";
import { placeOrder } from "../services/orders.js";
import { useNavigate } from "react-router-dom";

export const usePlaceOrder = ({ clearCart }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePlaceOrder = async (payload) => {
        try {
            setLoading(true);
            setError(null);

            const res = await placeOrder(payload);

            if (payload.paymentMethod === "COD") {
                clearCart?.();
                navigate('/orders')
            }

            if (payload.paymentMethod === "STRIPE") {
                console.log("Stripe flow here");
            }
        } catch (err) {
            console.error(err);
            setError(err?.message || "Something went wrong");
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
