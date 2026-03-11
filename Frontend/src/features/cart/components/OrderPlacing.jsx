import React from "react";

const OrderPlacing = () => {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="flex flex-col items-center gap-6">

                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-zinc-300 border-t-emerald-500 rounded-full animate-spin" />

                <p className="text-zinc-700 font-medium text-sm">
                    Placing your order...
                </p>

            </div>

        </div>
    );
};

export default OrderPlacing;