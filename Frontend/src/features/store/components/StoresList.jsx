import { ChevronUp, Store, Plus } from "lucide-react";
import React, { useState } from "react";
import useVendorStoreStore from "@/stores/useVendorStoreStore";
import { useNavigate } from "react-router-dom";
import StoreCard from "./StoreCard";

const StoresList = () => {
    const [open, setOpen] = useState(false);
    const { stores, currentStore, setCurrentStore } = useVendorStoreStore();
    const navigate = useNavigate();

    const handleStoreChange = (storeSlug) => {
        navigate(`/store/${storeSlug}/dashboard`);
        setCurrentStore(storeSlug);
        setOpen(false);
    };

    if (!stores || stores.length === 0) return null;

    return (
        <div className='p-3'>
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between gap-3 rounded-lg px-3 py-2 transition cursor-pointer
                ${open ? "bg-zinc-100" : "hover:bg-zinc-100"}
            `}
            >
                <div className='flex items-center gap-3 min-w-0'>
                    {/* Image on condition */}
                    <div className='relative'>
                        <div className='h-9 w-9 rounded-md bg-zinc-900 text-white flex items-center justify-center overflow-hidden ring-1 ring-zinc-300'>
                            {currentStore?.image ? (
                                <img
                                    src={currentStore.image.url}
                                    className='h-full w-full object-cover'
                                />
                            ) : (
                                <Store size={16} />
                            )}
                        </div>
                        {/* Green dot */}
                        <span className='absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white' />
                    </div>

                    <div className='text-left min-w-0'>
                        <p className='text-sm font-semibold truncate'>
                            {currentStore?.name || "Select Store"}
                        </p>
                        <span className='inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600'>
                            Active store
                        </span>
                    </div>
                </div>

                <ChevronUp
                    size={16}
                    className={`transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {/* Dropdown to switch stores */}
            {open && (
                <div className='mt-2 rounded-xl border border-zinc-200 bg-white shadow-lg p-1 space-y-1'>
                    {stores
                        .filter((store) => store._id !== currentStore?._id)
                        .map((store) => (
                            <StoreCard
                                store={store}
                                handleStoreChange={handleStoreChange}
                            />
                        ))}

                    <div className='my-1 h-px bg-zinc-200' />

                    {/* Create new store */}
                    <button
                        onClick={() => navigate("/request-store")}
                        className='w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 transition cursor-pointer'
                    >
                        <div className='h-8 w-8 rounded-md border border-dashed border-zinc-300 flex items-center justify-center'>
                            <Plus size={14} />
                        </div>
                        <span className='font-medium'>Create new store</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoresList;
