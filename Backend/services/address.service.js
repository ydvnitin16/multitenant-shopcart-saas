import Address from "../models/address.js";

export const addAddressService = async (data) => {
    console.log(data)
    const address = await Address.create(data);
    return address;
};

export const getUserAddressesService = async (userId) => {
    return await Address.find({ userId });
};
