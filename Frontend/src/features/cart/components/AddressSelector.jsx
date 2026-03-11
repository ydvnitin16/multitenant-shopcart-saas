import Button from "@/components/ui/Button";

const AddressSelector = ({ addresses, selected, setSelected, openModal }) => {
    return (
        <div className='bg-white border border-zinc-200 rounded-2xl p-6 space-y-6'>
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-semibold text-zinc-900'>
                    Shipping Address
                </h2>

                <Button size='sm' variant='secondary' onClick={openModal}>
                    Add Address
                </Button>
            </div>

            <div className='space-y-4'>
                {addresses.map((addr) => (
                    <label
                        key={addr._id}
                        className={`flex gap-4 border rounded-xl p-4 cursor-pointer transition
                        ${
                            selected === addr._id
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-zinc-200"
                        }`}
                    >
                        <input
                            type='radio'
                            checked={selected === addr._id}
                            onChange={() => setSelected(addr._id)}
                            className='mt-1 accent-emerald-600'
                        />

                        <div>
                            <p className='font-medium'>{addr.name}</p>

                            <p className='text-sm text-gray-600'>
                                {addr.street}, {addr.city}, {addr.state}
                            </p>

                            <p className='text-sm text-gray-600'>
                                {addr.country} - {addr.zipCode}
                            </p>

                            <p className='text-sm text-gray-600'>
                                {addr.phone}
                            </p>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default AddressSelector;
