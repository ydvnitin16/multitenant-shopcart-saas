import Button from "@/components/ui/Button";
import InlineLoader from "@/components/ui/InlineLoader";
import { Check, X } from "lucide-react";

const plans = [
    {
        name: "STARTER",
        price: "₹499/mo",
        description: "Good for a small catalog and regular store updates.",
        features: ["Add 50 products"],
    },
    {
        name: "PRO",
        price: "₹999/mo",
        description: "Best for a growing store with more serious selling.",
        features: ["Add unlimited products"],
    },
];

const SubscriptionModal = ({
    isOpen,
    onClose,
    onChoosePlan,
    loadingPlan,
    currentPlan = "FREE",
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
            <div
                className='absolute inset-0 bg-black/40 backdrop-blur-sm'
                onClick={onClose}
            />

            <div className='relative w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl'>
                <div className='flex items-start justify-between gap-4'>
                    <div>
                        <h2 className='text-xl font-semibold text-zinc-900'>
                            Upgrade store subscription
                        </h2>
                        <p className='mt-1 text-sm text-zinc-500'>
                            Choose a paid plan to unlock product actions for
                            this store.
                        </p>
                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900'
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className='mt-6 grid gap-4 md:grid-cols-2'>
                    {plans.map((plan) => {
                        const isCurrentPlan = currentPlan === plan.name;
                        const isLoading = loadingPlan === plan.name;

                        return (
                            <div
                                key={plan.name}
                                className='rounded-xl border border-zinc-200 p-5'
                            >
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <p className='text-sm font-semibold text-zinc-500'>
                                            {plan.name}
                                        </p>
                                        <h3 className='mt-1 text-2xl font-semibold text-zinc-900'>
                                            {plan.price}
                                        </h3>
                                    </div>

                                    {isCurrentPlan && (
                                        <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700'>
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p className='mt-3 text-sm text-zinc-500'>
                                    {plan.description}
                                </p>

                                <div className='mt-5 space-y-3'>
                                    {plan.features.map((feature) => (
                                        <div
                                            key={feature}
                                            className='flex items-center gap-2 text-sm text-zinc-700'
                                        >
                                            <Check
                                                size={16}
                                                className='text-emerald-600'
                                            />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type='button'
                                    className='mt-6 w-full'
                                    disabled={isLoading}
                                    onClick={() => onChoosePlan(plan.name)}
                                >
                                    {isLoading ? (
                                        <InlineLoader content='Opening checkout...' />
                                    ) : (
                                        `Choose ${plan.name}`
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;
