import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import StoreTableRow from "../components/StoreTableRow";
import SearchBar from "../components/SearchBar";
import useStores from "../hooks/useStores";
import Loader from "@/components/ui/Loader";
import StoreDetailsModal from "../components/StoreDetailsModal";

export const storesDummyData = [
    {
        name: "TechHub Electronics",
        description: "Electronics and gadgets store",
        slug: "techhub-electronics",
        userId: "65f1a1a1a1a1a1a1a1a1a1a1",
        status: "APPROVED",
        address: "123 Tech Street, Bangalore",
        isActive: true,
        image: {
            url: "https://dummyimage.com/600x400/000/fff",
            public_id: "techhub_img",
        },
        email: "john@techhub.com",
        contact: "+91 9876543210",
    },
    {
        name: "Fashion Forward",
        description: "Trendy fashion apparel",
        slug: "fashion-forward",
        userId: "65f2b2b2b2b2b2b2b2b2b2b2",
        status: "APPROVED",
        address: "22 Style Avenue, Mumbai",
        isActive: true,
        image: {
            url: "https://dummyimage.com/600x400/111/fff",
            public_id: "fashion_img",
        },
        email: "sarah@fashionfw.com",
        contact: "+91 9123456780",
    },
    {
        name: "Gourmet Foods",
        description: "Premium food and grocery store",
        slug: "gourmet-foods",
        userId: "65f3c3c3c3c3c3c3c3c3c3c3",
        status: "APPROVED",
        address: "88 Market Road, Delhi",
        isActive: true,
        image: {
            url: "https://dummyimage.com/600x400/222/fff",
            public_id: "food_img",
        },
        email: "mike@gourmetfoods.com",
        contact: "+91 9988776655",
    },
    {
        name: "Home Services Pro",
        description: "Home repair and services",
        slug: "home-services-pro",
        userId: "65f4d4d4d4d4d4d4d4d4d4d4",
        status: "REJECTED",
        address: "15 Service Lane, Pune",
        isActive: false,
        image: {
            url: "https://dummyimage.com/600x400/333/fff",
            public_id: "home_img",
        },
        email: "emily@homeservices.com",
        contact: "+91 9012345678",
    },
];

const STORE_HEADS = [
    "Store Name",
    "Owner",
    "Category",
    "Status",
    "Revenue",
    "Created",
    "Actions",
];

const Stores = () => {
    const { stores, loading, error } = useStores({ status: "APPROVED" });
    const [selectedStore, setSelectedStore] = useState(null);

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
                                        key={idx}
                                        store={store}
                                        setSelectedStore={setSelectedStore}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Stores;
