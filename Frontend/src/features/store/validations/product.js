import * as yup from 'yup';
export const productSchema = yup.object({
    name: yup.string().trim().min(5).required('Name is required.'),
    description: yup.string().min(10).required('Description is required'),
    category: yup.string().trim().min(2).required('Category is required'),
    mrp: yup.number().min(1).required('MRP is required'),
    price: yup.number().min(1).required('Price is required'),
    stock: yup.number().min(0).required('Stock is required'),
});
