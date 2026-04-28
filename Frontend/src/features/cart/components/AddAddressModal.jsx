import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addressSchema } from "../validations/address";
import { addAddress } from "../services/address";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

const AddAddressModal = ({ isOpen, onClose, refetch }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(addressSchema),
    });

    const onSubmit = async (data) => {
        try {
            await addAddress(data);
            refetch();
            onClose();
        } catch (err) {
            console.log(err.message);
            toast.error(err.message || "Something went wrong");
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className='fixed inset-0 bg-black/40 h-screen flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-xl max-h-[75vh] min-w-80 overflow-y-auto'>
                <h2 className='text-xl font-semibold mb-4'>
                    Add Shipping Address
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid md:grid-cols-2 gap-5'>
                        <Input
                            label='Full Name'
                            placeholder='John Doe'
                            {...register("name")}
                            error={errors.name?.message}
                        />

                        <Input
                            label='Email'
                            placeholder='johndoe@gmail.com'
                            {...register("email")}
                            error={errors.email?.message}
                        />

                        <Input
                            label='Phone'
                            placeholder='95824678XX'
                            {...register("phone")}
                            error={errors.phone?.message}
                        />

                        <Input
                            label='Street'
                            placeholder='78 street'
                            {...register("street")}
                            error={errors.street?.message}
                        />

                        <Input
                            label='City'
                            placeholder='Gurgaon'
                            {...register("city")}
                            error={errors.city?.message}
                        />

                        <Input
                            label='State'
                            placeholder='Haryana'
                            {...register("state")}
                            error={errors.state?.message}
                        />

                        <Input
                            label='Country'
                            placeholder='India'
                            {...register("country")}
                            error={errors.country?.message}
                        />

                        <Input
                            label='Zip Code'
                            placeholder='122001'
                            {...register("zipCode")}
                            error={errors.zipCode?.message}
                        />
                    </div>

                    <div className='flex justify-end gap-3 mt-6'>
                        <Button onClick={onClose} variant='outline'>
                            Cancel
                        </Button>
                        <Button type='submit'>Save Address</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;
