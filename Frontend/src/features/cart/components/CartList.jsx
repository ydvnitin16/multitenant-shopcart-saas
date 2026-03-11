import React from "react";
import CartListItem from "./CartListItem";
import { useCartItems } from "../hooks/useCartItems";
import InlineLoader from "@/components/ui/InlineLoader";
import OrderSummary from "./OrderSummary";
import useCartStore from "../../../stores/useCartStore";
import { useNavigate } from "react-router-dom";

const CartList = () => {
    const navigate = useNavigate();
    const { loading, cartItems, error } = useCartItems();
    const { removeFromCart, increaseQuantity, decreaseQuantity } =
        useCartStore();

    return (
        <div className='grid lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2 bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden'>
                {/* Table Header */}
                <div className='grid grid-cols-5 text-xs font-medium text-zinc-500 px-6 py-4 border-b border-zinc-200'>
                    <span className='col-span-3'>Item</span>
                    <span>Price</span>
                    <span>Quantity</span>
                </div>

                {/* List Items */}
                {error ? (
                    <p className='text-red-500'>{error}</p>
                ) : loading ? (
                    <InlineLoader size='xl' content='' />
                ) : cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <CartListItem
                            removeFromCart={removeFromCart}
                            increaseQuantity={increaseQuantity}
                            decreaseQuantity={decreaseQuantity}
                            key={item._id}
                            item={item}
                        />
                    ))
                ) : (
                    <p className='flex items-center justify-center h-60 text-zinc-600 font-semibold'>
                        Cart is empty
                    </p>
                )}

                <div className='px-6 py-4 bg-emerald-50 text-sm text-emerald-700'>
                    Items from different vendors may be shipped separately.
                </div>
            </div>

            {/* ORDER SUMMARY */}
            {cartItems.length > 0 && (
                <OrderSummary
                    items={cartItems}
                    buttonLabel='Proceed to Checkout'
                    onAction={() => navigate("/checkout")}
                />
            )}
        </div>
    );
};

export default CartList;
