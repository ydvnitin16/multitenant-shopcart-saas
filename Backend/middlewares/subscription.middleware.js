import Product from "../models/product.js";
import ApiError from "../utils/apiError.js";
import Store from "./../models/store.js";

export const PLAN_LIMITS = {
    FREE: {
        products: 20,
    },

    STARTER: {
        products: 100,
    },

    PRO: {
        products: Infinity,
    },
};

export const attachPlanFeatures = async (req, res, next) => {
    const store = req.store;

    if (!store) {
        throw new ApiError(400, "Store must be resolved first");
    }

    const plan = store?.subscriptionPlan || "FREE";

    req.planLimits = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;

    next();
};

export const isStorePlanActive = async (store) => {
    const isExpired =
        store.subscriptionExpiresAt &&
        new Date(store.subscriptionExpiresAt).getTime() < Date.now();

    if (isExpired) {
        if (isExpired && store.subscriptionPlan !== "FREE") {
            await Store.findByIdAndUpdate(store._id, {
                subscriptionPlan: "FREE",
            });
        }
    }
    return !isExpired;
};

export const enforceProductLimit = async (req, res, next) => {
    const store = req.store;
    const isPlanActive = await isStorePlanActive(store);

    const productCount = await Product.countDocuments({
        store: store._id,
    });

    if (!isPlanActive) {
        req.planLimits = PLAN_LIMITS["FREE"];
    }

    if (productCount >= req.planLimits.products) {
        throw new ApiError(403, "Product limit reached for current plan");
    }

    next();
};
