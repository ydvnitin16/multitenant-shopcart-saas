import Product from "../models/product.js";
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
    const storeId = req.store._id;
    const files = req.files;

    // attach images to the product
    const productImages = files.map((file) => {
        const image = {
            url: file.path,
            public_id: file.filename,
        };
        console.log(image);
        return image;
    });
    req.body.images = productImages;

    const product = await storeProductService({ ...req.body, storeId });

    ApiSuccess(res, 200, "Product created successfully", { product });
};

// Admin -> Delete product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Entered`);

        const product = await Product.findByIdAndDelete(id);
        console.log(product);
        if (!product)
            return res.status(404).json({ message: "Product Not Exist" });

        return res
            .status(200)
            .json({ message: "Product Deleted Successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error. please try again later.",
        });
    }
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const storeId = req.store._id;

    const updatedProduct = await updateProductService(
        productId,
        storeId,
        req.body,
    );
    ApiSuccess(res, 200, "Product Updated Successfully.", {
        product: updatedProduct,
    });
};

export const getMyStoreProducts = async (req, res) => {
    const storeId = req.store._id;
    const { products, total } = await getProductsByStoreService({ storeId });
    ApiSuccess(res, 200, "Product Updated Successfully.", {
        products,
        total,
    });
};

export const getProducts = async (req, res) => {
    const { page, limit, sortBy, order, storeId } = req.query;

    const data = await getProductsService({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sortBy: sortBy || "createdAt",
        order: order || "desc",
        storeId,
    });

    res.status(200).json({
        success: true,
        ...data,
    });
};

export const getProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await getProductByIdService(productId);

    res.status(200).json({ success: true, product });
};

export const getCartProducts = async (req, res) => {
    const { ids } = req.query;

    if (!ids) {
        return res.status(400).json({
            success: false,
            message: "Product IDs are required",
        });
    }

    const idsArray = ids.split(",");

    const products = await getProductsByIdsService(idsArray);

    return res.status(200).json({
        success: true,
        products,
    });
};
