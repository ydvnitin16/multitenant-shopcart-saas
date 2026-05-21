import React from "react";
import StoreRequestCard from "../components/StoreRequestCard";
import useStores from "../hooks/useStores";
import Loader from "@/components/ui/Loader";
import Pagination from "@/components/ui/Pagination";

const StoreRequests = () => {
    const [page, setPage] = React.useState(1);
    const {
        stores,
        pagination,
        loading,
        approveStore,
        rejectStore,
        isLoading,
    } = useStores({
        status: "PENDING",
        page,
        limit: 6,
    });

    React.useEffect(() => {
        if (pagination.page !== page) {
            setPage(pagination.page);
        }
    }, [page, pagination.page]);

    if (loading) {
        return <Loader />;
    }
    return (
        <main className='w-full flex-1 px-5 md:px-8 py-3 md:py-6'>
            <div className='flex items-center justify-between mb-6'>
                <div className='w-full flex flex-col sm:flex-row justify-between text-3xl font-bold'>
                    <h1>Stores Requests</h1>
                    <div className='text-xl text-zinc-700'>
                        Pending Request: ({pagination.total})
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
            {!stores.length && (
                <div className='rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center text-zinc-500'>
                    No pending store requests found.
                </div>
            )}
            {pagination.pages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    setPage={setPage}
                />
            )}
        </main>
    );
};

export default StoreRequests;
