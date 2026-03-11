import { useEffect, useState } from "react";
import OrderSummary from "../components/OrderSummary";
import { useCartItems } from "../hooks/useCartItems";
import AddressSelector from "../components/AddressSelector";
import AddAddressModal from "../components/AddAddressModal";
import { useAddresses } from "../hooks/useAddresses";
import { usePlaceOrder } from "../hooks/usePlaceOrder";
import useCartStore from "../../../stores/useCartStore";
import PaymentSelector from "../components/PaymentSelector";
import OrderPlacing from "../components/OrderPlacing";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const { clearCart, cart } = useCartStore();

    const navigate = useNavigate();
    if (!cart.length) {
        navigate("/cart");
    }

    const { cartItems } = useCartItems();

    const { addresses, refetch: refetchAddresses } = useAddresses();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("COD"); // default
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { loading: placeOrderLoading, handlePlaceOrder } = usePlaceOrder({
        clearCart,
    });

    useEffect(() => {
        if (addresses?.length && !selectedAddress) {
            setSelectedAddress(addresses[0]._id);
        }
    }, [addresses]);

    const onPlaceOrder = () => {
        handlePlaceOrder({
            addressId: selectedAddress,
            paymentMethod,
            items: cart,
        });
    };

    return (
        <div className='min-h-screen bg-zinc-50 pt-28 px-6'>
            {placeOrderLoading && <OrderPlacing />}

            <div className='max-w-6xl mx-auto grid lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 space-y-8'>
                    <AddressSelector
                        addresses={addresses}
                        selected={selectedAddress}
                        setSelected={setSelectedAddress}
                        openModal={() => setIsModalOpen(true)}
                    />

                    <AddAddressModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        refetch={refetchAddresses}
                    />

                    <PaymentSelector
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
                </div>

                <div className='lg:sticky lg:top-28 h-fit'>
                    <OrderSummary
                        items={cartItems}
                        buttonLabel='Place Order'
                        onAction={onPlaceOrder}
                        showPromo={false}
                        showItems={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
