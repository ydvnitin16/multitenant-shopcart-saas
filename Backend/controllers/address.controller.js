import {
    addAddressService,
    getUserAddressesService,
} from "../services/address.service.js";

export const addAddress = async (req, res) => {
    const userId = req.user.id;

    const address = await addAddressService({
        ...req.body,
        userId,
    });

    res.status(201).json({
        success: true,
        address,
    });
};

export const fetchAddresses = async (req, res) => {
    const userId = req.user.id;

    const addresses = await getUserAddressesService(userId);

    res.json({
        success: true,
        addresses,
    });
};
