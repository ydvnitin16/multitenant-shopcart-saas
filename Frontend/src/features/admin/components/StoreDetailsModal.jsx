import Button from '@/components/ui/Button';
import {
    X,
    Mail,
    Phone,
    MapPin,
    CheckCircle,
    XCircle,
    Clock,
    Store as StoreIcon,
    User,
} from 'lucide-react';

const STATUS_STYLES = {
    APPROVED: {
        label: 'Approved',
        className: 'bg-green-100 text-green-700',
        icon: <CheckCircle size={14} />,
    },
    PENDING: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-700',
        icon: <Clock size={14} />,
    },
    REJECTED: {
        label: 'Rejected',
        className: 'bg-red-100 text-red-700',
        icon: <XCircle size={14} />,
    },
};

const StoreDetailsModal = ({ store, onClose }) => {
    if (!store) return null;

    const status = STATUS_STYLES[store.status];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
                <div className="px-6 py-6 border-b border-zinc-200">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-5">
                            {store.image?.url ? (
                                <img
                                    src={store.image.url}
                                    alt="Store"
                                    className="w-24 h-24 rounded-2xl object-cover border border-zinc-200"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl border border-zinc-200 bg-zinc-100 flex items-center justify-center">
                                    <StoreIcon className="text-zinc-400" />
                                </div>
                            )}

                            <div>
                                <h2 className="text-xl font-semibold text-zinc-900">
                                    {store.name}
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    @{store.slug}
                                </p>

                                <div className="mt-2 flex gap-4">
                                    <span
                                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-lg border border-zinc-200`}
                                    >
                                        Category
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full ${status.className}`}
                                    >
                                        {status.icon}
                                        {status.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-zinc-100"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm text-zinc-700">
                        {store.description || 'No description provided.'}
                    </div>

                    <section>
                        <h3 className="text-sm font-medium text-zinc-900 mb-3">
                            Store Contact
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-zinc-400" />
                                {store.email}
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={14} className="text-zinc-400" />
                                {store.contact}
                            </div>

                            <div className="flex items-center gap-2 sm:col-span-2">
                                <MapPin size={14} className="text-zinc-400" />
                                {store.address}
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-sm font-medium text-zinc-900 mb-3">
                            Store Owner
                        </h3>

                        <div className="flex items-center gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                            {store.user?.image ? (
                                <img
                                    src={store.user.image.url}
                                    alt="Owner"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center">
                                    <User size={18} className="text-zinc-500" />
                                </div>
                            )}

                            <div>
                                <p className="font-medium text-zinc-900">
                                    {store.user?.name || 'Unknown Owner'}
                                </p>
                                <p className="text-sm text-zinc-500">
                                    {store.user?.email}
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                            <p className="text-zinc-500 mb-1">Active</p>
                            <p className="font-medium">
                                {store.isActive ? 'Yes' : 'No'}
                            </p>
                        </div>

                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                            <p className="text-zinc-500 mb-1">Store ID</p>
                            <p className="font-medium truncate">{store._id}</p>
                        </div>
                    </section>
                </div>

                <div className="px-6 py-4 border-t border-zinc-200 flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailsModal;
