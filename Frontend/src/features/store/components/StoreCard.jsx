import { Store } from 'lucide-react';
import React from 'react';

const StoreCard = ({ store, handleStoreChange }) => {
    return (
        <button
            key={store._id}
            onClick={() => handleStoreChange(store.slug)}
            className="group relative w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-zinc-100 cursor-pointer"
        >
            {/* Accent bar on hover */}
            <span className="absolute left-0 top-1/2 h-0 w-0.5 bg-zinc-900 group-hover:h-6 group-hover:-translate-y-1/2 transition-all rounded-full" />

            <div className="h-8 w-8 rounded-md bg-zinc-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {store.image ? (
                    <img
                        src={store.image?.url}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <Store size={14} />
                )}
            </div>

            <div className="text-left min-w-0 flex-1">
                <p className="font-medium truncate">{store.name}</p>
                <span className="text-xs text-zinc-500 truncate">
                    @{store.slug}
                </span>
            </div>

            <span className="text-[11px] text-zinc-400 opacity-0 group-hover:opacity-100 transition">
                Switch
            </span>
        </button>
    );
};

export default StoreCard;
