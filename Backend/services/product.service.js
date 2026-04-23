import Product from "../models/product.js";
import ApiError from "../utils/apiError.js";

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
    const skip = (page - 1) * limit;

    const filter = {};

    if (store) {
        filter.store = store;
    }

    const sortOption = {
        [sortBy]: order === "desc" ? -1 : 1,
    };

    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("store", "name slug");

    const totalProducts = await Product.countDocuments(filter);

    return {
        products,
        pagination: {
            total: totalProducts,
            page: Number(page),
            pages: Math.ceil(totalProducts / limit),
        },
    };
};

export const getProductByIdService = async (id) => {
    const product = await Product.findOne({ _id: id }).populate("store", "name slug image");

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    return product;
};

export const getProductsByIdsService = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) {
        return [];
    }

    const products = await Product.find({
        _id: { $in: ids },
    });

    return products;
};
