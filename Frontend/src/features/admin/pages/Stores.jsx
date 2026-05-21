import React, { useEffect, useState } from "react";
import StoreTableRow from "../components/StoreTableRow";
import SearchBar from "../components/SearchBar";
import useStores from "../hooks/useStores";
import Loader from "@/components/ui/Loader";
import StoreDetailsModal from "../components/StoreDetailsModal";
import Pagination from "@/components/ui/Pagination";

const STORE_HEADS = [
    "Store Name",
    "Owner",
    "Contact",
    "Status",
    "Plan",
    "Created",
    "Actions",
];

const Stores = () => {
    const [page, setPage] = useState(1);
    const [selectedStore, setSelectedStore] = useState(null);
    const { stores, pagination, loading, toggleStoreActivation, isLoading } =
        useStores({
            status: "APPROVED",
            page,
            limit: 10,
        });

    useEffect(() => {
        if (pagination.page !== page) {
            setPage(pagination.page);
        }
    }, [page, pagination.page]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {selectedStore && (
                <StoreDetailsModal
                    store={selectedStore}
                    onClose={() => setSelectedStore(null)}
                />
            )}
            {/* Main Content */}
            <main className='flex-1 p-10'>
                <div className='flex items-center justify-between mb-6'>
                    <div>
                        <h1 className='text-3xl font-bold'>
                            Stores Management
                        </h1>
                        <p className='text-zinc-500 mt-1'>
                            Manage and monitor all registered stores on the
                            platform.
                        </p>
                    </div>
                </div>

                {/* Card */}
                <div className='bg-white rounded-xl shadow-sm border border-zinc-200'>
                    <SearchBar />

                    {/* Table */}
                    <div className='overflow-x-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-zinc-50 text-zinc-600'>
                                <tr>
                                    {STORE_HEADS.map((h, idx) => (
                                        <th
                                            key={idx}
                                            className='text-left px-6 py-4'
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-zinc-100'>
                                {stores.map((store, idx) => (
                                    <StoreTableRow
                                        key={store._id || idx}
                                        store={store}
                                        onSelect={setSelectedStore}
                                        onToggleActivation={toggleStoreActivation}
                                        loading={isLoading(store._id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!stores.length && (
                        <div className='px-6 py-12 text-center text-zinc-500'>
                            No approved stores found.
                        </div>
                    )}

                    {pagination.pages > 1 && (
                        <div className='px-6 pb-6'>
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.pages}
                                setPage={setPage}
                            />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Stores;
