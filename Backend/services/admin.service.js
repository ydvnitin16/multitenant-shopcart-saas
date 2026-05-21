import mongoose from "mongoose";
import ApiError from "../utils/apiError.js";
import OrderItem from "../models/orderItem.js";
import ParentOrder from "../models/parentOrder.js";
import Product from "../models/product.js";
import Store from "../models/store.js";
import StoreOrder from "../models/storeOrder.js";
import User from "../models/user.js";

export const getAdminStoresService = async ({
    status,
    page = 1,
    limit = 10,
} = {}) => {
    const query = {};
    const perPage = Math.max(Number(limit) || 10, 1);

    if (status && status !== "ALL") {
        query.status = status;
    }

    const total = await Store.countDocuments(query);
    const totalPages = Math.max(Math.ceil(total / perPage), 1);
    const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

    const stores = await Store.find(query)
        .select(
            "name slug status isActive image email contact address description subscriptionPlan subscriptionStatus subscriptionExpiresAt createdAt updatedAt user",
        )
        .populate("user", "name email image")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .lean();

    return {
        stores,
        pagination: {
            total,
            page: currentPage,
            limit: perPage,
            pages: totalPages,
        },
    };
};

export const getAdminStatsService = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [
        totalStores,
        activeStores,
        pendingRequests,
        totalProducts,
        totalOrders,
        todayOrders,
        totalCustomers,
        totalRevenue,
        monthlyRevenue,
        subscriptionPlanCounts,
        revenueLast7DaysRaw,
    ] = await Promise.all([
        Store.countDocuments(),
        Store.countDocuments({ isActive: { $eq: true } }),
        Store.countDocuments({ status: { $eq: "PENDING" } }),
        Product.countDocuments(),
        ParentOrder.countDocuments({ isPaid: { $eq: true } }),
        ParentOrder.countDocuments({
            isPaid: { $eq: true },
            createdAt: { $gt: today, $lt: tomorrow },
        }),
        User.countDocuments({ role: { $eq: "CUSTOMER" } }),
        ParentOrder.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]).then((result) => result[0]?.totalRevenue || 0),
        ParentOrder.aggregate([
            {
                $match: {
                    isPaid: true,
                    updatedAt: { $gte: monthStart },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                },
            },
        ]).then((result) => result[0]?.totalRevenue || 0),
        Store.aggregate([
            {
                $group: {
                    _id: "$subscriptionPlan",
                    count: { $sum: 1 },
                },
            },
        ]),
        ParentOrder.aggregate([
            {
                $match: {
                    isPaid: true,
                    updatedAt: {
                        $gte: sevenDaysAgo,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$updatedAt",
                        },
                    },
                    revenue: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),
    ]);

    const subscriptions = {
        free: 0,
        starter: 0,
        pro: 0,
    };

    subscriptionPlanCounts.forEach(({ _id, count }) => {
        if (!_id) return;
        subscriptions[_id.toLowerCase()] = count;
    });

    const planEntries = Object.entries(subscriptions);
    const mostSelectedPlanEntry = planEntries.reduce(
        (selectedPlan, currentPlan) =>
            currentPlan[1] > selectedPlan[1] ? currentPlan : selectedPlan,
        ["free", 0],
    );

    const revenueLast7DaysMap = new Map(
        revenueLast7DaysRaw.map((entry) => [entry._id, entry]),
    );

    const revenueLast7Days = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + index);

        const key = date.toISOString().slice(0, 10);
        const day = revenueLast7DaysMap.get(key);

        return {
            date: key,
            label: date.toLocaleDateString("en-IN", { weekday: "short" }),
            revenue: day?.revenue || 0,
            orders: day?.orders || 0,
        };
    });

    return {
        totalStores,
        activeStores,
        pendingRequests,
        totalProducts,
        totalOrders,
        todayOrders,
        totalCustomers,
        totalRevenue,
        monthlyRevenue,
        subscriptions,
        revenueLast7Days,
    };
};
