import { useNavigate } from "react-router-dom";
import CartList from "../components/CartList";

const Cart = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-zinc-50 pt-24 px-6'>
            <div className='max-w-7xl mx-auto space-y-12'>
                {/* Header */}
                <div className='flex items-start justify-between'>
                    <div>
                        <h1 className='text-2xl font-semibold text-zinc-900'>
                            Your Shopping Cart
                        </h1>
                        <p className='text-sm text-zinc-500 mt-1'>
                            Review your items before proceeding to checkout
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/shop")}
                        className='text-sm text-emerald-600 hover:underline cursor-pointer'
                    >
                        ← Continue Shopping
                    </button>
                </div>

                <CartList />
            </div>
        </div>
    );
};

export default Cart;
