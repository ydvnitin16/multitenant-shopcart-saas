import React from "react";

const PaymentSelector = ({ paymentMethod, setPaymentMethod }) => {
    const methods = [
        {
            id: "COD",
            label: "Cash on Delivery",
        },
    ];

    return (
        <div className='bg-white border border-zinc-200 rounded-2xl p-8 space-y-6'>
            <h2 className='text-lg font-semibold text-zinc-900'>
                Payment Method
            </h2>

            <div className='space-y-4'>
                {methods.map((method) => (
                    <label
                        key={method.id}
                        className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition
                        ${
                            paymentMethod === method.id
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-zinc-200 hover:border-emerald-500"
                        }`}
                    >
                        <input
                            type='radio'
                            name='payment'
                            checked={paymentMethod === method.id}
                            onChange={() => setPaymentMethod(method.id)}
                            className='accent-emerald-600'
                        />

                        <span className='text-sm text-zinc-700'>
                            {method.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default PaymentSelector;
