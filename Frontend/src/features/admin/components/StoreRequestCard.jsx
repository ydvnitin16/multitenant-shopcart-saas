import Button from '@/components/ui/Button';
import InlineLoader from '@/components/ui/InlineLoader';
import { CircleCheckBig, CircleX, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

const StoreRequestCard = ({ store, approveStore, rejectStore, loading }) => {
    const badgeStyle = {
        PENDING:
            'px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 whitespace-nowrap',
        APPROVED:
            'px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 whitespace-nowrap',
        REJECTED:
            'px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 whitespace-nowrap',
    };

    return (
        <div className="w-full bg-white border border-zinc-300 rounded-2xl shadow-sm ">
            <div className="p-5 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap text-end gap-2">
                    <div className="flex items-center gap-4">
                        <img
                            className="w-16 h-16 rounded-xl object-cover border border-zinc-300 bg-zinc-50 shrink-0"
                            src={store.image?.url}
                            alt="store image"
                        />

                        <div className="flex flex-col">
                            <span className="text-lg font-semibold text-zinc-900">
                                {store.name}
                            </span>
                            <span className="text-sm text-zinc-500 italic">
                                @{store.slug}
                            </span>
                        </div>
                    </div>

                    <span className={badgeStyle[store.status]}>
                        {store.status}
                    </span>
                </div>

                {/* Store details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-semibold">
                    <div className="flex items-center gap-2 text-zinc-900">
                        <span className="text-zinc-500 font-medium">
                            Owner:
                        </span>
                        <span>{store.userId?.name || 'Unknown'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-900 sm:col-span-2">
                        <Mail size={15} className="text-zinc-500 shrink-0" />
                        <span>{store.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-900">
                        <MapPin size={15} className="text-zinc-500 shrink-0" />
                        <span>{store.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-900">
                        <Phone size={15} className="text-zinc-500 shrink-0" />
                        <span>{store.contact}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-600 leading-relaxed">
                    {store.description}
                </div>

                <div className="text-zinc-600 text-sm m-0">
                    Submitted on: 01/01/2026
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {loading ? (
                        <InlineLoader content="Updating Status..." />
                    ) : store.status !== 'PENDING' ? (
                        ''
                    ) : (
                        <>
                            <Button
                                disabled={loading}
                                onClick={() => approveStore(store._id)}
                                variant="secondary"
                                className="sm:flex-1 gap-2 justify-center"
                            >
                                <CircleCheckBig size={18} />
                                Approve Request
                            </Button>

                            <Button
                                disabled={loading}
                                onClick={() => rejectStore(store._id)}
                                variant="primary"
                                className="sm:flex-1 gap-2 justify-center"
                            >
                                <CircleX size={18} />
                                Reject Request
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoreRequestCard;
