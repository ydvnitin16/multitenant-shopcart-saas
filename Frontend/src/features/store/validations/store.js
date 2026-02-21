import * as yup from 'yup'

export const storeSchema = yup.object().shape({
    name: yup.string().required("Store name is required"),
    slug: yup.string().required("Slug is required"),
    description: yup.string().required("Description is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    contact: yup
        .string()
        .required("Contact number is required")
        .min(8, "Invalid contact number"),
    address: yup.string().required("Address is required"),
    image: yup.mixed().required("Store logo is required"),
});
