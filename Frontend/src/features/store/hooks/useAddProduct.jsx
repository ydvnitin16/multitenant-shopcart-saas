import { useState } from 'react';
import { addProduct } from '../services/product.api';
import toast from 'react-hot-toast';

const useAddProduct = ({ storeSlug, reset }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [images, setImages] = useState([]);

    // store images in the state which allows to store multiple images
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages((prev) => [...prev, ...selectedFiles]);
    };

    const onSubmit = async (formData) => {
        try {
            setLoading(true);
            const formatedData = new FormData();

            formatedData.append('name', formData.name);
            formatedData.append('description', formData.description);
            formatedData.append('category', formData.category);
            formatedData.append('price', formData.price);
            formatedData.append('mrp', formData.mrp);
            formatedData.append('stock', formData.stock);

            // append all the imges in the FormData to send backend
            for (let i = 0; i < images?.length; i++) {
                formatedData.append('images', images[i]);
            }

            if (images.length < 1) {
                throw Error('Please add at least one product image');
            }

            const data = await addProduct(storeSlug, formatedData);
            toast.success(data.message || 'Product added succesfully');
            reset();
            setImages([]);
        } catch (err) {
            console.log(err.message);
            setError(err.message || 'Something went wrong');
            toast.error(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, onSubmit, images, handleImageChange };
};

export default useAddProduct;
