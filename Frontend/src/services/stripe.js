import { fetchService } from "./fetchService";

export const cancelCheckoutSession = async ({ parentOrderId, sessionId }) => {
    return fetchService({
        endpoint: "stripe/checkout/cancel",
        method: "POST",
        body: { parentOrderId, sessionId },
    });
};
