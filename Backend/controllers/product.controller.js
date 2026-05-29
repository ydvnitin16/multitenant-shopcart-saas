import Product from "../models/product.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";
import {
    getProductByIdService,
    getProductsByIdsService,
    getProductsByStoreService,
    getProductsService,
    storeProductService,
    updateProductService,
} from "../services/product.service.js";
import ApiSuccess from "../utils/apiSuccess.js";

// Admin -> Add product
export const createProduct = async (req, res) => {
    const store = req.store._id;
    const files = req.files;

    // attach images to the product
    const productImages = files.map((file) => {
        const image = {
            url: file.path,
            public_id: file.filename,
        };
        return image;
    });
    req.body.images = productImages;

    const product = await storeProductService({ ...req.body, store });

    ApiSuccess(res, 200, "Product created successfully", { product });
};

// Admin -> Delete product
export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const store = req.store._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product id");
    }

    const product = await Product.findOneAndDelete({
        _id: productId,
        store,
    });

    if (!product) {
        throw new ApiError(404, "Product not found in this store");
    }

    ApiSuccess(res, 200, "Product deleted successfully");
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const store = req.store._id;

    const updatedProduct = await updateProductService(
        productId,
        store,
        req.body,
    );
    ApiSuccess(res, 200, "Product Updated Successfully.", {
        product: updatedProduct,
    });
};

export const getMyStoreProducts = async (req, res) => {
    const store = req.store._id;
    const { products, total } = await getProductsByStoreService({ store });
    ApiSuccess(res, 200, "Product Updated Successfully.", {
        products,
        total,
    });
};

export const getProducts = async (req, res) => {
    const { page, limit, sortBy, order, storeId, store } = req.query;

    const data = await getProductsService({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: sortBy || "createdAt",
        order: order || "desc",
        store: store || storeId,
    });

    ApiSuccess(res, 200, "Products retrieved successfully", data);
};

export const getProduct = async (req, res) => {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    ApiSuccess(res, 200, "Product retrieved successfully", { product });
};

export const getCartProducts = async (req, res) => {
    const { ids } = req.query;

    if (!ids) {
        throw new ApiError(400, "Product IDs are required");
    }

    const idsArray = ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

    const products = await getProductsByIdsService(idsArray);

    ApiSuccess(res, 200, "Cart products retrieved successfully", {
        products,
    });
};
