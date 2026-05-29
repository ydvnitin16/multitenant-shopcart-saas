import Product from "../models/product.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

export const storeProductService = async ({
    name,
    description,
    category,
    mrp,
    price,
    images,
    stock,
    store,
}) => {
    const product = await Product.create({
        name,
        description,
        category,
        mrp: Number(mrp),
        price: Number(price),
        images,
        stock: Number(stock ?? 0),
        store,
    });
    return product;
};

export const updateProductService = async (productId, store, updates) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product id");
    }

    const product = await Product.findOne({ _id: productId, store });

    if (!product)
        throw new ApiError(404, "Product does not belong to this store");

    const safeUpdates = {};

    const ALLOWED_FIELDS_TO_UPDATE = [
        "price",
        "mrp",
        "description",
        "stock",
        "category",
    ];

    for (let field of ALLOWED_FIELDS_TO_UPDATE) {
        if (updates[field] !== undefined && updates[field] !== null) {
            if (["price", "mrp", "stock"].includes(field)) {
                safeUpdates[field] = Number(updates[field]);
                continue;
            }

            safeUpdates[field] = updates[field];
        }
    }    

    Object.assign(product, safeUpdates);

    await product.save();
    return product;
};

export const getProductsByStoreService = async ({ store }) => {
    const products = await Product.find({ store });

    const total = await Product.countDocuments({ store });

    return {
        products,
        total,
    };
};

export const getProductsService = async ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    store,
}) => {
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * perPage;

    const filter = {};

    if (store) {
        if (!mongoose.Types.ObjectId.isValid(store)) {
            throw new ApiError(400, "Invalid store id");
        }

        filter.store = store;
    }

    const allowedSortFields = ["createdAt", "updatedAt", "price", "mrp", "stock", "name"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sortOption = {
        [safeSortBy]: order === "asc" ? 1 : -1,
    };

    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(perPage)
        .populate("store", "name slug");

    const totalProducts = await Product.countDocuments(filter);

    return {
        products,
        pagination: {
            total: totalProducts,
            page: currentPage,
            limit: perPage,
            pages: Math.ceil(totalProducts / perPage),
        },
    };
};

export const getProductByIdService = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid product id");
    }

    const product = await Product.findOne({ _id: id }).populate(
        "store",
        "name slug image",
    );

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return product;
};

export const getProductsByIdsService = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        return [];
    }

    const invalidId = ids.find((id) => !mongoose.Types.ObjectId.isValid(id));

    if (invalidId) {
        throw new ApiError(400, "Invalid product id in cart");
    }

    const products = await Product.find({
        _id: { $in: ids },
    });

    return products;
};
