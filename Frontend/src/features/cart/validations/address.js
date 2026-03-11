import * as yup from "yup";

export const addressSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
    phone: yup
        .string()
        .matches(/^[0-9]{10}$/, "Invalid phone number")
        .required(),

    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    country: yup.string().required("Country is required"),
    zipCode: yup.string().required("Zip code is required"),
});