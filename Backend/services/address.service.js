import Address from "../models/address.js";
import ApiError from "../utils/apiError.js";

export const addAddressService = async (data) => {
    const requiredFields = [
        "name",
        "email",
        "country",
        "state",
        "zipCode",
        "city",
        "street",
        "phone",
    ];

    const missingField = requiredFields.find((field) => !data[field]);

    if (missingField) {
        throw new ApiError(400, `${missingField} is required`);
    }

    const address = await Address.create(data);
    return address;
};

export const getUserAddressesService = async (user) => {
    return await Address.find({ user });
};
