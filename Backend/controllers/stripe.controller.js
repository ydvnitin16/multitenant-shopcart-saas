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
        session = await stripe.checkout.sessions.create(
            {
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
                expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
            },
            {
                idempotencyKey: `checkout-${order._id.toString()}`, // stripe should not charge 2 times for single order
            },
        );
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

export const cancelSubscription = async (req, res) => {
    const store = req.store;
    const userId = req.user.id;

    const currentSubscription = await Subscription.findOne({
        store: store._id,
        status: "ACTIVE",
    }).sort({ createdAt: -1 });

    if (
        !currentSubscription ||
        !["STARTER", "PRO"].includes(currentSubscription.plan)
    ) {
        throw new ApiError(404, "No Active subscription found");
    }

    if (currentSubscription.cancelAtPeriodEnd)
        throw new ApiError(
            400,
            "Subscription is already scheduled for cancellation.",
        );

    try {
        await stripe.subscriptions.update(
            currentSubscription.stripeSubscriptionId,
            { cancel_at_period_end: true },
        );

        currentSubscription.cancelAtPeriodEnd = true;
        await currentSubscription.save();

        ApiSuccess(
            res,
            200,
            "Subscription will be cancelled at the end of the billing period.",
        );
    } catch (err) {
        console.log(err.message);
        throw new ApiError(500, "Failed to cancel your active subscription");
    }
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
            case "customer.subscription.updated":
            case "customer.subscription.deleted": {
                const subscription = event.data.object;
                let invoiceId = null;
                let amountPaid = 0;

                if (subscription.latest_invoice) {
                    const invoice = await stripe.invoices.retrieve(
                        typeof subscription.latest_invoice === "string"
                            ? subscription.latest_invoice
                            : subscription.latest_invoice.id,
                    );
                    invoiceId = invoice.id;
                    amountPaid = invoice.amount_paid;
                }

                await syncStoreSubscription(subscription, {
                    stripeInvoiceId: invoiceId,
                    amountPaid: amountPaid,
                });
                break;
            }
            case "invoice.payment_succeeded": {
                const invoice = event.data.object;

                const subscriptionId =
                    invoice.subscription ||
                    invoice.parent.subscription_details.subscription;

                if (subscriptionId) {
                    const subscription =
                        await stripe.subscriptions.retrieve(subscriptionId);

                    await syncStoreSubscription(subscription, {
                        stripeInvoiceId: invoice.id,
                        amountPaid: invoice.amount_paid,
                    });
                }

                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object;

                const subscriptionId =
                    invoice.subscription ||
                    invoice.parent.subscription_details.subscription;

                if (subscriptionId) {
                    const subscription =
                        await stripe.subscriptions.retrieve(subscriptionId);
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
                    const stripePaymentIntentId =
                        typeof session.payment_intent === "string"
                            ? session.payment_intent
                            : (session.payment_intent?.id ?? null);

                    if (parentOrderId) {
                        await updateParentOrderPaymentStatus({
                            parentOrderId,
                            paymentStatus: "CANCELLED",
                            stripePaymentIntentId,
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

    if (store.subscriptionPlan === plan)
        throw new ApiError(400, "You already have that plan");

    if (store.subscriptionPlan === "PRO" && plan === "STARTER") {
        throw new ApiError(
            400,
            "Your current plan is already active, you cannot degrade your plan",
        );
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
        success_url: `${process.env.CLIENT_URL}/store/${store.slug}/dashboard`,
        cancel_url: `${process.env.CLIENT_URL}/store/${store.slug}/dashboard`,
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

export const upgradeSubscription = async (req, res) => {
    const store = req.store;
    const { plan } = req.body;

    if (plan !== "PRO")
        throw new ApiError(400, "Only upgrading to PRO is supported.");

    if (store.subscriptionPlan === "PRO")
        throw new ApiError(400, "You are already on the PRO plan.");

    if (store.subscriptionPlan === "FREE")
        throw new ApiError(
            400,
            "You don't have an active subscription. Please subscribe first.",
        );

    const selectedPriceId = subscriptionPriceIds[plan];
    if (!selectedPriceId)
        throw new ApiError(500, "Stripe price not configured.");

    const currentSubscription = await Subscription.findOne({
        store: store._id,
        status: "ACTIVE",
    }).sort({ createdAt: -1 });

    if (!currentSubscription?.stripeSubscriptionId)
        throw new ApiError(404, "No active Stripe subscription found.");

    const stripeSubscription = await stripe.subscriptions.retrieve(
        currentSubscription.stripeSubscriptionId,
    );

    const currentItemId = stripeSubscription.items.data[0]?.id;
    if (!currentItemId)
        throw new ApiError(500, "Could not find subscription item to upgrade.");

    try {
        await stripe.subscriptions.update(
            currentSubscription.stripeSubscriptionId,
            {
                items: [{ id: currentItemId, price: selectedPriceId }],
                proration_behavior: "create_prorations",
                payment_behavior: "error_if_incomplete",
                metadata: { storeId: store._id.toString(), plan },
                cancel_at_period_end: false,
            },
        );

        if (currentSubscription.cancelAtPeriodEnd) {
            currentSubscription.cancelAtPeriodEnd = false;
            await currentSubscription.save();
        }

        ApiSuccess(
            res,
            200,
            "Plan upgraded successfully. Your card has been charged the prorated amount.",
        );
    } catch (err) {
        console.error("Stripe upgrade error:", err.message);
        throw new ApiError(
            500,
            "Failed to upgrade your subscription. Please try again.",
        );
    }
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

    const isExpired =
        store.subscriptionExpiresAt &&
        new Date(store.subscriptionExpiresAt).getTime() < Date.now();

    ApiSuccess(res, 200, "Subscription retrieved successfully", {
        subscription: {
            plan: store.subscriptionPlan,
            status: isExpired ? "EXPIRED" : "ACTIVE",
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
    if (!stripeInvoiceId && status === "ACTIVE") return;

    const periodStartDate = periodStart ? new Date(periodStart * 1000) : null;
    const periodEndDate = periodEnd ? new Date(periodEnd * 1000) : null;

    const updateFields = {
        plan,
        status,
        currentPeriodStart: periodStartDate,
        currentPeriodEnd: periodEndDate,
        ...(stripeInvoiceId ? { stripeInvoiceId } : {}),
        ...(amountPaid > 0 ? { amountPaid: amountPaid / 100 } : {}),
    };

    await Subscription.findOneAndUpdate(
        { store: storeId, stripeSubscriptionId },
        { $set: updateFields },
        { new: true },
    );

    await Store.findByIdAndUpdate(storeId, {
        subscriptionPlan: status === "ACTIVE" ? plan : "FREE",
        subscriptionExpiresAt:
            status === "ACTIVE" && periodEndDate ? periodEndDate : null,
    });
};
