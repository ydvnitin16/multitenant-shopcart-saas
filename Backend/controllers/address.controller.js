import {
    addAddressService,
    getUserAddressesService,
} from "../services/address.service.js";
import ApiSuccess from "../utils/apiSuccess.js";

export const addAddress = async (req, res) => {
    const user = req.user.id;

    const address = await addAddressService({
        ...req.body,
        user,
    });

    ApiSuccess(res, 201, "Address added successfully", { address });
};

export const fetchAddresses = async (req, res) => {
    const user = req.user.id;

    const addresses = await getUserAddressesService(user);

    ApiSuccess(res, 200, "Addresses retrieved successfully", { addresses });
};
