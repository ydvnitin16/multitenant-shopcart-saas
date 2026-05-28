import React, { useEffect, useState } from "react";
import StoreTableRow from "../components/StoreTableRow";
import useStores from "../hooks/useStores";
import Loader from "@/components/ui/Loader";
import StoreDetailsModal from "../components/StoreDetailsModal";
import Pagination from "@/components/ui/Pagination";
import { useSearchParams } from "react-router-dom";
import PageShell from "@/components/layout/PageShell";

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
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page"));

    const [selectedStore, setSelectedStore] = useState(null);
    const { stores, pagination, loading, toggleStoreActivation, isLoading } =
        useStores({
            status: "APPROVED",
            page,
            limit: 5,
        });

    useEffect(() => {
        if (pagination.page !== page) {
            searchParams.set("page", pagination.page);
            setSearchParams(searchParams);
        }
    }, [pagination.page]);

    function setPage(newPage) {
        setSearchParams({
            page: String(newPage),
        });
    }

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
            <PageShell
                title='Stores Management'
                description='Manage and monitor all registered stores on the
                            platform.'
                actions={
                    <div className='font-medium italic'>
                        Total Store: {pagination.total}
                    </div>
                }
            >
                {/* Stores table */}
                <div className='overflow-x-auto border border-zinc-300 rounded-xl'>
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

                {/* Pagnination */}
                {pagination.total > 0 && (
                    <div className='px-6 pb-6'>
                        <Pagination
                            currentPage={page}
                            totalPages={pagination.pages}
                            onPrev={() => setPage(page - 1)}
                            onNext={() => setPage(page + 1)}
                        />
                    </div>
                )}
            </PageShell>
        </>
    );
};

export default Stores;
