import ParentOrder from "../models/parentOrder.js";
import Store from "../models/store.js";
import Subscription from "../models/subscription.js";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";
import { updateParentOrderPaymentStatus } from "../services/order.service.js";
import stripe from "./../config/stripe.js";
import mongoose from "mongoose";

// Utils
const subscriptionPriceIds = {
    STARTER: process.env.STRIPE_STARTER_PRICE_ID,
    PRO: process.env.STRIPE_PRO_PRICE_ID,
};

// For Subscription
const getSubscriptionPeriod = (subscription) => {
    const item = subscription.items?.data?.[0];

    return {
        start: subscription.current_period_start || item?.current_period_start,
        end: subscription.current_period_end || item?.current_period_end,
    };
};

const getPlanFromSubscription = (subscription) => {
    const priceId = subscription.items?.data?.[0]?.price?.id;
    return (
        Object.entries(subscriptionPriceIds).find(
            ([, id]) => id === priceId,
        )?.[0] ||
        subscription.metadata?.plan ||
        "FREE"
    );
};

const mapStripeSubscriptionStatus = (status, fallbackStatus) => {
    if (fallbackStatus) return fallbackStatus;
    if (status === "active" || status === "trialing") return "ACTIVE";
    if (status === "canceled" || status === "unpaid") return "CANCELLED";
    return "EXPIRED";
};

export const createPaymentCheckoutSession = async (req, res) => {
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

    const paymentStatus = order?.paymentStatus || "PENDING";

    if (order.paymentMethod !== "CARD") {
        throw new ApiError(
            400,
            "Stripe checkout is only available for card orders.",
        );
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
            case "checkout.session.completed": {
                const session = event.data.object;

                if (session.mode === "subscription") {
                    const storeId = session.metadata?.storeId;

                    if (!storeId || !session.subscription) {
                        return;
                    }

                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription,
                    );
                    await syncStoreSubscription(subscription);
                }

                break;
            }
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                await syncStoreSubscription(subscription);
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;

                if (invoice.subscription) {
                    const subscription = await stripe.subscriptions.retrieve(
                        invoice.subscription,
                    );
                    await syncStoreSubscription(subscription, {
                        stripeInvoiceId: invoice.id,
                        amountPaid: invoice.amount_paid,
                    });
                }

                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object;

                if (invoice.subscription) {
                    const subscription = await stripe.subscriptions.retrieve(
                        invoice.subscription,
                    );
                    await syncStoreSubscription(subscription, {
                        stripeInvoiceId: invoice.id,
                        amountPaid: invoice.amount_paid,
                        fallbackStatus: "EXPIRED",
                    });
                }

                break;
            }
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
            case "checkout.session.expired": {
                const session = event.data.object;

                if (session.mode === "payment") {
                    const parentOrderId = session.metadata?.parentOrderId;

                    if (parentOrderId) {
                        await updateParentOrderPaymentStatus({
                            parentOrderId,
                            paymentStatus: "CANCELLED",
                        });
                    }
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

export const createSubscriptionCheckoutSession = async (req, res) => {
    const { storeId, plan } = req.body;
    const userId = req.user.id;

    if (!["STARTER", "PRO"].includes(plan)) {
        throw new ApiError(400, "Invalid subscription plan");
    }

    const selectedPriceId = subscriptionPriceIds[plan];

    if (!selectedPriceId) {
        throw new ApiError(500, "Stripe price not configured.");
    }

    const store = await Store.findOne({ _id: storeId, user: userId });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    if (!store?.stripeCustomerId) {
        const customer = await stripe.customers.create({
            name: store.name,
            email: store.email,
        });
        store.stripeCustomerId = customer.id;
        await store.save();
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: store.stripeCustomerId,
        line_items: [
            {
                price: selectedPriceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/store/${store.slug}/dashboard?subscription=success`,
        cancel_url: `${process.env.CLIENT_URL}/store/${store.slug}/dashboard?subscription=cancelled`,
        metadata: {
            storeId: store._id.toString(),
            plan,
        },
        subscription_data: {
            metadata: {
                storeId: store._id.toString(),
                plan,
            },
        },
    });
    ApiSuccess(res, 200, "Subscription checkout session created", {
        url: session.url,
    });
};

const syncStoreSubscription = async (
    subscription,
    { stripeInvoiceId = null, amountPaid = null, fallbackStatus = null } = {},
) => {
    const storeId = subscription.metadata?.storeId;

    if (!storeId) {
        return;
    }

    const { start, end } = getSubscriptionPeriod(subscription);
    const status = mapStripeSubscriptionStatus(
        subscription.status,
        fallbackStatus,
    );

    await updateStoreSubscription({
        storeId,
        stripeSubscriptionId: subscription.id,
        stripeInvoiceId,
        amountPaid,
        plan: getPlanFromSubscription(subscription),
        status,
        periodStart: start,
        periodEnd: end,
    });
};

export const getStoreSubscription = async (req, res) => {
    const store = req.store;
    const subscription = await Subscription.findOne({ store: store._id }).sort({
        createdAt: -1,
    });

    ApiSuccess(res, 200, "Subscription retrieved successfully", {
        subscription: {
            plan: store.subscriptionPlan,
            status: store.subscriptionStatus,
            expiresAt: store.subscriptionExpiresAt,
            stripeCustomerId: store.stripeCustomerId,
            record: subscription,
        },
    });
};

const updateStoreSubscription = async ({
    storeId,
    stripeSubscriptionId,
    stripeInvoiceId = null,
    amountPaid = null,
    plan,
    status,
    periodStart,
    periodEnd,
}) => {
    await Subscription.findOneAndUpdate(
        { store: storeId },
        {
            store: storeId,
            plan,
            status,
            stripeSubscriptionId,
            stripeInvoiceId,
            ...(amountPaid > 0 ? { amountPaid: amountPaid / 100 } : {}),
            currentPeriodStart: periodStart
                ? new Date(periodStart * 1000)
                : null,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    await Store.findByIdAndUpdate(storeId, {
        subscriptionPlan: status === "ACTIVE" ? plan : "FREE",
        subscriptionStatus: status,
        subscriptionExpiresAt: periodEnd ? new Date(periodEnd * 1000) : null,
    });
};
