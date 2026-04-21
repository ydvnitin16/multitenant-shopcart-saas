import React from "react";
import StoreRequestCard from "../components/StoreRequestCard";
import useStores from "../hooks/useStores";
import Loader from "@/components/ui/Loader";

const StoreRequests = () => {
    const {
        stores,
        setStores,
        loading,
        error,
        approveStore,
        rejectStore,
        isLoading,
    } = useStores({
        status: "PENDING",
    });

    if (loading) {
        return <Loader />;
    }
    return (
        <main className='w-full flex-1 px-5 md:px-8 py-3 md:py-6'>
            <div className='flex items-center justify-between mb-6'>
                <div className='w-full flex flex-col sm:flex-row justify-between text-3xl font-bold'>
                    <h1>Stores Requests</h1>
                    <div className='text-xl text-zinc-700'>
                        Pending Request: ({stores.length})
                    </div>
                </div>
            </div>
            <div className='grid  gap-2 bg-white rounded-2xl overflow-hidden'>
                {stores.map((store) => (
                    <StoreRequestCard
                        key={store._id}
                        approveStore={approveStore}
                        rejectStore={rejectStore}
                        store={store}
                        loading={isLoading(store._id)}
                    />
                ))}
            </div>
        </main>
    );
};

export default StoreRequests;
