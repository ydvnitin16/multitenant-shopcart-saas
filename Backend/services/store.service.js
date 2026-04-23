import Store from "../models/store.js";
import ApiError from "../utils/apiError.js";
import { cloudinary } from "../config/cloudinary.js";
import streamifier from "streamifier";
import StoreOrder from "../models/storeOrder.js";
import OrderItem from "../models/orderItem.js";

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
    console.log(image);

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
        isActive: true,
        address,
        email,
        contact,
    });

    return store;
};

const allowedStatuses = ["PENDING", "APPROVED", "REJECTED"];

export const updateStoreStatusService = async ({ storeId, status }) => {
    let store = await Store.findById(storeId);
    if (!store) throw new ApiError(404, "Store not exist");

    if (!status || !allowedStatuses.includes(status))
        throw new ApiError(400, "Invalid store status");

    store.status = status;
    if (status === "APPROVED") {
        store.isActive = true;
    }

    const updatedStore = await store.save();

    return updatedStore;
};

export const getStoresService = async (query) => {
    const stores = await Store.find(query).populate("user", "-password -role ");
    return stores || [];
};

export const getStoreService = async (query) => {
    const store = await Store.findOne(query);
    if (!store) {
        throw new ApiError(404, "Store not found");
    }
    return store;
};

export const getStoreOrdersService = async (storeId) => {
    const storeOrders = await StoreOrder.find({ store: storeId })
        .populate("address")
        .populate("parentOrder", "paymentMethod isPaid createdAt")
        .sort({ createdAt: -1 })
        .lean();

    for (const order of storeOrders) {
        const items = await OrderItem.find({
            storeOrder: order._id,
        }).populate("product", "name images");

        order.items = items;
    }

    return storeOrders;
};
