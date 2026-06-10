import Product from "../models/product.js";
import Store from "../models/store.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
    "electronics",
    "fashion",
    "home",
    "beauty",
    "sports",
    "books",
    "toys",
    "groceries",
    "automotive",
    "other",
];

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
    if (!PRODUCT_CATEGORIES.includes(category.toLowerCase())) {
        throw new ApiError(400, "Invalid category");
    }

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

            safeUpdates[field] =
                field === "category" ? updates[field].trim().toLowerCase() : updates[field];
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
    category,
}) => {
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const currentPage = Math.max(Number(page) || 1, 1);
    const skip = (currentPage - 1) * perPage;

    const filter = {};
    const activeStoreFilter = { status: "APPROVED", isActive: true };

    if (store) {
        if (!mongoose.Types.ObjectId.isValid(store)) {
            throw new ApiError(400, "Invalid store id");
        }

        const activeStore = await Store.findOne({
            _id: store,
            ...activeStoreFilter,
        }).select("_id");

        if (!activeStore) {
            return {
                products: [],
                categories: PRODUCT_CATEGORIES,
                pagination: {
                    total: 0,
                    page: currentPage,
                    limit: perPage,
                    pages: 0,
                },
            };
        }

        filter.store = store;
    } else {
        const activeStoreIds =
            await Store.find(activeStoreFilter).distinct("_id");
        filter.store = { $in: activeStoreIds };
    }

    const categoryFilterBase = { ...filter };
    const categories = await Product.distinct("category", categoryFilterBase);

    if (category) {
        if (!PRODUCT_CATEGORIES.includes(category)) {
            throw new ApiError(400, "Invalid category");
        }

        filter.category = category;
    }

    const allowedSortFields = ["createdAt", "price", "name"];
    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const sortOption = {
        [safeSortBy]: order === "asc" ? 1 : -1,
    };

    const [products, totalProducts] = await Promise.all([
        Product.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(perPage)
            .populate("store", "name slug")
            .lean(),

        Product.countDocuments(filter),
    ]);

    return {
        products,
        categories: PRODUCT_CATEGORIES,
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
        "name slug image status isActive",
    );

    if (
        !product ||
        !product.store?.isActive ||
        product.store?.status !== "APPROVED"
    ) {
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
    }).populate("store", "status isActive");

    return products.filter(
        (product) =>
            product.store?.isActive && product.store?.status === "APPROVED",
    );
};
