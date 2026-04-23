import {
    addAddressService,
    getUserAddressesService,
} from "../services/address.service.js";

export const addAddress = async (req, res) => {
    const user = req.user.id;

    const address = await addAddressService({
        ...req.body,
        user,
    });

    res.status(201).json({
        success: true,
        address,
    });
};

export const fetchAddresses = async (req, res) => {
    const user = req.user.id;

    const addresses = await getUserAddressesService(user);

    res.json({
        success: true,
        addresses,
    });
};
