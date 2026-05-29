import Store from "../models/store.js";
import ApiError from "../utils/apiError.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";
import StoreOrder from "../models/storeOrder.js";
import OrderItem from "../models/orderItem.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

export const createStoreService = async ({
    name,
    description,
    slug,
    user,
    image,
    address,
    email,
    contact,
}) => {
    const isAlreadyExists = await Store.findOne({ slug });
    if (isAlreadyExists)
        throw new ApiError(409, "Store with this slug already exists!");

    // Now upload the image to cloud so that if validation fails or slug already exists the image will not be uploaded on the cloud
    const uploadFromBuffer = () =>
        new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "stores" },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                },
            );

            streamifier.createReadStream(image.buffer).pipe(stream);
        });

    const uploadedImage = await uploadFromBuffer();

    const imageToStore = {
        url: uploadedImage.url,
        public_id: uploadedImage.public_id,
    };

    const store = await Store.create({
        name,
        description: description || "",
        slug,
        user,
        status: "PENDING",
        image: imageToStore || null,
        isActive: false,
        address,
        email,
        contact,
    });

    return store;
};

const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

export const updateStoreStatusService = async ({ storeId, status }) => {
    let store = await Store.findById(storeId).select(
        "status isActive _id user",
    );
    if (!store) throw new ApiError(404, "Store not exist");

    if (!status || !allowedStatuses.includes(status))
        throw new ApiError(400, "Invalid store status");

    store.status = status;
    store.isActive = status === "APPROVED";

    await store.save();
    return store;
};

export const updateStoreActivationService = async ({ storeId, isActive }) => {
    const store = await Store.findById(storeId).select(
        "isActive status _id user",
    );

    if (!store) throw new ApiError(404, "Store not exist");

    if (typeof isActive !== "boolean") {
        throw new ApiError(400, "isActive must be a boolean value");
    }

    if (store.status !== "APPROVED") {
        throw new ApiError(
            400,
            "Only approved stores can be activated or deactivated",
        );
    }

    store.isActive = isActive;

    return store.save();
};

export const getStoresService = async (query) => {
    const stores = await Store.find(query);
    return stores || [];
};

export const getStoreService = async (query) => {
    const store = await Store.findOne(query);
    if (!store) {
        throw new ApiError(404, "Store not found");
    }
    return store;
};

export const getStoreOrdersService = async ({
    storeId,
    page = 1,
    limit = 10,
}) => {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
        throw new ApiError(400, "Invalid store id");
    }

    const storeObjectId = new mongoose.Types.ObjectId(storeId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const perPage = Math.max(Number(limit) || 10, 1);
    const total = await StoreOrder.countDocuments({ store: storeId });
    const totalPages = Math.max(Math.ceil(total / perPage), 1);
    const currentPage = Math.min(Math.max(Number(page) || 1, 1), totalPages);

    /* Orders List */
    const storeOrders = await StoreOrder.find({
        store: storeObjectId,
    })
        .populate("address")
        .populate("parentOrder", "paymentMethod isPaid createdAt")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * limit)
        .limit(perPage)
        .lean();

    const orderIds = storeOrders.map((order) => order._id);

    const items = await OrderItem.find({
        storeOrder: {
            $in: orderIds,
        },
    }).populate("product", "name images");

    const itemMap = {};

    items.forEach((item) => {
        const key = item.storeOrder.toString();

        if (!itemMap[key]) itemMap[key] = [];

        itemMap[key].push(item);
    });

    storeOrders.forEach((order) => {
        order.items = itemMap[order._id.toString()] || [];
    });

    /* Stats */
    const [
        todayOrders,
        pendingOrders,
        shippedOrders,
        deliveredToday,
        cancelledToday,
        revenueAgg,
    ] = await Promise.all([
        StoreOrder.countDocuments({
            store: storeObjectId,
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
        }),
        StoreOrder.countDocuments({
            store: storeObjectId,
            status: "PENDING",
        }),
        StoreOrder.countDocuments({
            store: storeObjectId,
            status: "DELIVERED",
            updatedAt: {
                $gte: today,
                $lt: tomorrow,
            },
        }),
        StoreOrder.countDocuments({
            store: storeObjectId,
            status: "SHIPPED",
        }),
        StoreOrder.countDocuments({
            store: storeObjectId,
            status: "CANCELLED",
            updatedAt: {
                $gte: today,
                $lt: tomorrow,
            },
        }),
        StoreOrder.aggregate([
            {
                $match: {
                    store: storeObjectId,
                    status: "DELIVERED",
                    updatedAt: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$vendorEarnings",
                    },
                },
            },
        ]),
    ]);

    return {
        stats: {
            todayOrders,
            pendingOrders,
            shippedOrders,
            deliveredToday,
            cancelledToday,
            revenueToday: revenueAgg[0]?.total || 0,
        },

        orders: storeOrders,
        total: storeOrders.length,
        pagination: {
            total,
            page: currentPage,
            limit: perPage,
            pages: totalPages,
        },
    };
};

export const getStoreStatsService = async (store) => {
    const storeObjectId = new mongoose.Types.ObjectId(store._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    let [
        totalProducts,
        todayOrders,
        deliveredOrders,
        lowStockProducts,
        outOfStockProducts,
        revenueSummary,
        uniqueCustomers,
        salesLast7DaysRaw,
    ] = await Promise.all([
        Product.countDocuments({ store: storeObjectId }),
        StoreOrder.countDocuments({
            store: storeObjectId,
            createdAt: {
                $gte: today,
                $lt: tomorrow,
            },
        }),
        StoreOrder.countDocuments({
            store: storeObjectId,
            status: "DELIVERED",
        }),
        Product.find({
            store: storeObjectId,
            stock: { $gte: 0, $lte: 5 },
        })
            .sort({ stock: 1, updatedAt: -1 })
            .limit(5)
            .select("name stock price images")
            .lean(),
        Product.countDocuments({
            store: storeObjectId,
            stock: { $lte: 0 },
        }),
        StoreOrder.aggregate([
            {
                $match: {
                    store: storeObjectId,
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $cond: [
                                { $eq: ["$status", "DELIVERED"] },
                                "$vendorEarnings",
                                0,
                            ],
                        },
                    },
                    revenueToday: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$status", "DELIVERED"] },
                                        { $gte: ["$updatedAt", today] },
                                        { $lt: ["$updatedAt", tomorrow] },
                                    ],
                                },
                                "$vendorEarnings",
                                0,
                            ],
                        },
                    },
                    totalOrders: { $sum: 1 },
                },
            },
        ]),
        StoreOrder.distinct("address", { store: storeObjectId }),

        StoreOrder.aggregate([
            {
                $match: {
                    store: storeObjectId,
                    status: "DELIVERED",
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
                    revenue: { $sum: "$vendorEarnings" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),
    ]);

    const salesLast7DaysMap = new Map(
        salesLast7DaysRaw.map((item) => [item._id, item]),
    );

    const salesLast7Days = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + (index + 1));

        const key = date.toISOString().slice(0, 10);
        const dayStats = salesLast7DaysMap.get(key);

        return {
            date: key,
            label: date.toLocaleDateString("en-IN", { weekday: "short" }),
            revenue: dayStats?.revenue || 0,
            orders: dayStats?.orders || 0,
        };
    });
    console.log(salesLast7Days);

    const totals = revenueSummary[0] || {
        totalRevenue: 0,
        revenueToday: 0,
        totalOrders: 0,
    };
    const totalCustomers = uniqueCustomers.length;
    const totalRevenue = totals.totalRevenue || 0;
    const totalOrders = totals.totalOrders || 0;

    return {
        store,
        stats: {
            totalRevenue,
            revenueToday: totals.revenueToday || 0,
            totalOrders,
            todayOrders,
            totalProducts,
            lowStockCount: lowStockProducts.length,
            outOfStockCount: outOfStockProducts,
            totalCustomers,
            avgOrderValue: deliveredOrders ? totalRevenue / deliveredOrders : 0,
        },
        salesLast7Days,
        lowStockProducts,
    };
};

export const getStoreFrontService = async () => {
    const store = await Store.findOne(query).select(
        "name description slug address image email contact ",
    );
    if (!store) {
        throw new ApiError(404, "Store not found");
    }
    return store;
};
