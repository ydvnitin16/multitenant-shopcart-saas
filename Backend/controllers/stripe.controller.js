import ParentOrder from "../models/parentOrder.js";
import { handlePaymentIntent } from "../services/order.service.js";
import stripe from "./../config/stripe.js";
export const createCheckoutSession = async (req, res) => {
    const { parentOrderId } = req.body;
    console.log(parentOrderId);

    const order = await ParentOrder.findById(parentOrderId);
    console.log(order);
    const session = await stripe.checkout.sessions.create({
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

        success_url: `${process.env.CLIENT_URL}/orders`,
        cancel_url: `${process.env.CLIENT_URL}/cart`,

        metadata: {
            parentOrderId: order._id.toString(),
        },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.json({ url: session.url });
};

export const stripeWebhookHandler = async (req, res) => {
    console.log("Stripe Webhook Called!");
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
                const session = event.data.object;
                const parentOrderId = session.metadata?.parentOrderId;

                if (parentOrderId) {
                    await handlePaymentIntent(parentOrderId, true);
                }
                break;
            }
            case "payment_intent.canceled": {
                const session = event.data.object;
                const parentOrderId = session.metadata?.parentOrderId;

                if (parentOrderId) {
                    await handlePaymentIntent(parentOrderId, false);
                }
                break;
            }
            default:
                console.error(event.type);
                break;
        }
    } catch (err) {
        return res
            .status(500)
            .send(`Webhook processing failed: ${err.message}`);
    }

    return res.status(200).json({ received: true });
};
