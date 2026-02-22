import Product from "../models/product.js";
import Store from "../models/store.js";
import ApiError from "../utils/apiError.js";

export const storeProductService = async ({
    name,
    description,
    mrp,
    price,
    images,
    storeId,
}) => {
    const product = await Product.create({
        name,
        description,
        mrp: Number(mrp),
        price: Number(price),
        images: images,
        storeId: storeId,
        inStock: true,
    });
    return product;
};

export const updateProductService = async (productId, storeId, updates) => {
    const product = await Product.findOne({ _id: productId, storeId: storeId });

    if (!product)
        throw new ApiError(404, "Product does not belong to this store");

    const safeUpdates = {};

    const ALLOWED_FIELDS_TO_UPDATE = ["price", "mrp", "description", "inStock"];

    for (let field of ALLOWED_FIELDS_TO_UPDATE) {
        if (updates[field] !== undefined && updates[field] !== null) {
            safeUpdates[field] = updates[field];
        }
    }
    Object.assign(product, safeUpdates);

    await product.save();
    return product;
};

export const getProductsByStoreService = async ({ storeId }) => {
    const products = await Product.find({ storeId });

    const total = await Product.countDocuments({ storeId });

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
    storeId,
}) => {
    const skip = (page - 1) * limit;

    const filter = { inStock: true };

    if (storeId) {
        filter.storeId = storeId;
    }

    const sortOption = {
        [sortBy]: order === "desc" ? -1 : 1,
    };

    const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .populate("storeId", "name slug");

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
