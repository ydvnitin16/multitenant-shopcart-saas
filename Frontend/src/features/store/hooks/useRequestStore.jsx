import { useState } from "react";
import toast from "react-hot-toast";
import { requestStore } from "../services/store.api";

export const useRequestStore = ({ reset }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const storeRequestHandler = async (formData) => {
        try {
            const supportedFormData = new FormData();

            supportedFormData.append("name", formData.name);
            supportedFormData.append("slug", formData.slug);
            supportedFormData.append("description", formData.description);
            supportedFormData.append("email", formData.email);
            supportedFormData.append("contact", formData.contact);
            supportedFormData.append("address", formData.address);
            supportedFormData.append("image", formData.image[0]);

            setError(null);
            setLoading(true);
            console.log(supportedFormData);
            const data = await requestStore(supportedFormData);
            console.log(data);

            toast.success("Store request created successfully");
        } catch (err) {
            const message = err.message || "Something went wrong";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return { storeRequestHandler, loading, error };
};
