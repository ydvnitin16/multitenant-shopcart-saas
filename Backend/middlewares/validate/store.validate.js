import ApiError from "../../utils/apiError.js";

export const validateCreateStoreForm = (req, res, next) => {
    const { name, slug, address, email, contact } = req.body;
    const image = req.file;

    // required fields
    if (!name || !slug || !address || !email || !contact) {
        throw new ApiError(400, "All required fields must be provided");
    }

    if (typeof name !== "string" || name.trim().length < 3) {
        throw new ApiError(400, "Store name must be at least 3 characters");
    }

    const slugRegex = /^[a-z0-9-]+$/;
    if (typeof slug !== "string" || !slugRegex.test(slug)) {
        throw new ApiError(400, "Invalid slug format");
    }

    if (typeof address !== "string" || !address.trim()) {
        throw new ApiError(400, "Address is required");
    }

    if (image === null || image === undefined) {
        throw new ApiError(400, "Image is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email address");
    }

    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
        throw new ApiError(400, "Invalid contact number");
    }

    next();
};
