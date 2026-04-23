import ApiError from '../../utils/apiError.js';

const validateProduct = (req, res, next) => {
    const { name, description, category, price, mrp, stock } = req.body;
    const images = req.files;
    console.log(req.body, images)
    if (!name || !description || !category || !mrp || !price)
        throw new ApiError(400, 'Please fill all required fields');

    if (name.length < 5)
        throw new ApiError(400, 'Name must contain at least 5 characters');

    if (description.length < 10)
        throw new ApiError(
            400,
            'Description must contain at least 10 characters',
        );

    if (category.length < 2)
        throw new ApiError(400, 'Category must contain at least 2 characters');

    if (isNaN(mrp) || Number(mrp) < 1)
        throw new ApiError(
            400,
            'MRP must be a number greater than or equal to 1',
        );

    if (isNaN(price) || Number(price) < 1)
        throw new ApiError(
            400,
            'Price must be a number greater than or equal to 1',
        );

    if (stock !== undefined && (isNaN(stock) || Number(stock) < 0))
        throw new ApiError(
            400,
            'Stock must be a number greater than or equal to 0',
        );

    if (!images || images.length === 0)
        throw new ApiError(400, 'Please upload at least one product image');

    next();
};

export const validateProductUpdate = (req, res, next) => {
    if (req.body === undefined) {
        throw new ApiError(400, 'At least one field is required to update');
    }
    
    const { price, mrp, description, category, stock } = req.body;

    const allowedFields = ['price', 'mrp', 'description', 'category', 'stock'];
    const requestFields = Object.keys(req.body);

    if (requestFields.length === 0) {
        throw new ApiError(400, 'At least one field is required to update');
    }

    const invalidFields = requestFields.filter(
        (field) => !allowedFields.includes(field),
    );

    if (invalidFields.length > 0) {
        throw new ApiError(
            400,
            `You are not allowed to update: ${invalidFields.join(', ')}`,
        );
    }

    if (price !== undefined) {
        if (isNaN(price) || Number(price) < 1) {
            throw new ApiError(
                400,
                'Price must be a number greater than or equal to 1',
            );
        }
    }

    if (mrp !== undefined) {
        if (isNaN(mrp) || Number(mrp) < 1) {
            throw new ApiError(
                400,
                'MRP must be a number greater than or equal to 1',
            );
        }
    }

    if (description !== undefined) {
        if (description.length < 10) {
            throw new ApiError(
                400,
                'Description must contain at least 10 characters',
            );
        }
    }

    if (category !== undefined && category.length < 2) {
        throw new ApiError(400, 'Category must contain at least 2 characters');
    }

    if (stock !== undefined) {
        if (isNaN(stock) || Number(stock) < 0) {
            throw new ApiError(
                400,
                'Stock must be a number greater than or equal to 0',
            );
        }
    }

    next();
};

export { validateProduct };
