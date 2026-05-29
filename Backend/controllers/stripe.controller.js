import ParentOrder from "../models/parentOrder.js";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";
import { updateParentOrderPaymentStatus } from "../services/order.service.js";
import stripe from "./../config/stripe.js";
import mongoose from "mongoose";

const getEffectivePaymentStatus = (order) => {
    if (order?.paymentStatus) {
        return order.paymentStatus;
    }

    if (order?.paymentMethod !== "CARD") {
        return order?.isPaid ? "PAID" : "PENDING";
    }

    return order?.isPaid ? "PAID" : "PENDING";
};

export const createCheckoutSession = async (req, res) => {
    const { parentOrderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(parentOrderId)) {
        throw new ApiError(400, "Invalid order id.");
    }

    const order = await ParentOrder.findOne({
        _id: parentOrderId,
        user: req.user.id,
    });
    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    const paymentStatus = getEffectivePaymentStatus(order);

    if (order.paymentMethod !== "CARD") {
        throw new ApiError(400, "Stripe checkout is only available for card orders.");
    }

    if (paymentStatus === "PAID") {
        throw new ApiError(400, "This order has already been paid.");
    }

    if (["FAILED", "CANCELLED"].includes(paymentStatus)) {
        throw new ApiError(
            400,
            "This payment attempt is no longer active. Please place the order again.",
        );
    }

    let session;

    try {
        session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Order Payment",
                        },
                        unit_amount: order.totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],

            success_url: `${process.env.CLIENT_URL}/orders?checkout=success&session_id={CHECKOUT_SESSION_ID}&parentOrderId=${order._id}`,
            cancel_url: `${process.env.CLIENT_URL}/orders?checkout=cancelled&session_id={CHECKOUT_SESSION_ID}&parentOrderId=${order._id}`,

            metadata: {
                parentOrderId: order._id.toString(),
            },
            payment_intent_data: {
                metadata: {
                    parentOrderId: order._id.toString(),
                },
            },
        });
    } catch (error) {
        await updateParentOrderPaymentStatus({
            parentOrderId: order._id,
            paymentStatus: "FAILED",
        });
        throw new ApiError(
            500,
            "Stripe checkout could not be started. Stock has been restored, so please try again.",
        );
    }

    order.stripeSessionId = session.id;
    await order.save();

    ApiSuccess(res, 200, "Stripe checkout session created", {
        url: session.url,
    });
};

export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET,
        );
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                const parentOrderId = paymentIntent.metadata?.parentOrderId;

                if (parentOrderId) {
                    await updateParentOrderPaymentStatus({
                        parentOrderId,
                        paymentStatus: "PAID",
                        stripePaymentIntentId: paymentIntent.id,
                    });
                }
                break;
            }
            case "payment_intent.canceled": {
                const paymentIntent = event.data.object;
                const parentOrderId = paymentIntent.metadata?.parentOrderId;

                if (parentOrderId) {
                    await updateParentOrderPaymentStatus({
                        parentOrderId,
                        paymentStatus: "CANCELLED",
                        stripePaymentIntentId: paymentIntent.id,
                    });
                }
                break;
            }
            default:
                break;
        }
    } catch (err) {
        return res
            .status(500)
            .send(`Webhook processing failed: ${err.message}`);
    }

    return res.status(200).json({ received: true });
};

export const cancelCheckoutSession = async (req, res) => {
    const { parentOrderId, sessionId } = req.body;

    if (!parentOrderId || !sessionId) {
        throw new ApiError(400, "parentOrderId and sessionId are required.");
    }

    if (!mongoose.Types.ObjectId.isValid(parentOrderId)) {
        throw new ApiError(400, "Invalid order id.");
    }

    const order = await ParentOrder.findOne({
        _id: parentOrderId,
        user: req.user.id,
    });

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }

    if (order.paymentMethod !== "CARD") {
        throw new ApiError(400, "This order does not use Stripe checkout.");
    }

    if (order.stripeSessionId !== sessionId) {
        throw new ApiError(400, "This Stripe session does not match the order.");
    }

    const paymentStatus = getEffectivePaymentStatus(order);

    if (paymentStatus === "PAID") {
        return ApiSuccess(res, 200, "This order has already been paid.", {
            paymentStatus,
        });
    }

    if (["FAILED", "CANCELLED"].includes(paymentStatus)) {
        return ApiSuccess(res, 200, "This checkout session is already unpaid.", {
            paymentStatus,
        });
    }

    try {
        await stripe.checkout.sessions.expire(sessionId);
    } catch (error) {
        if (error?.code === "checkout_session_completed") {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === "paid") {
                const updatedOrder = await updateParentOrderPaymentStatus({
                    parentOrderId,
                    paymentStatus: "PAID",
                    stripeSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent,
                });

                return ApiSuccess(res, 200, "This order has already been paid.", {
                    paymentStatus: updatedOrder.paymentStatus,
                });
            }
        }

        const alreadyTerminal = error?.code === "session_already_expired";

        if (!alreadyTerminal) {
            throw error;
        }
    }

    const updatedOrder = await updateParentOrderPaymentStatus({
        parentOrderId,
        paymentStatus: "CANCELLED",
        stripeSessionId: sessionId,
    });

    return ApiSuccess(res, 200, "Stripe checkout cancelled and stock restored.", {
        paymentStatus: updatedOrder.paymentStatus,
    });
};
