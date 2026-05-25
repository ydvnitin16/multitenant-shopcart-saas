import Button from "@/components/ui/Button";
import InlineLoader from "@/components/ui/InlineLoader";

const statusStyles = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border border-emerald-200",

    INACTIVE: "bg-red-50 text-red-700 border border-red-200",
};

const StoreTableRow = ({
    store,
    onSelect,
    onToggleActivation,
    loading = false,
}) => {
    return (
        <tr
            className='cursor-pointer
    transition-all
    bg-white
    hover:bg-zinc-50
    hover:shadow-sm'
            onClick={() => onSelect(store)}
        >
            <td className='px-6 py-4 align-top'>
                <p className='font-medium text-zinc-900'>{store.name}</p>
                <p className='text-xs text-zinc-500'>@{store.slug}</p>
            </td>

            <td className='px-6 py-4 align-top'>
                <p className='font-medium text-zinc-900'>
                    {store.user?.name || "Unknown Owner"}
                </p>
                <p className='text-xs text-zinc-500'>{store.user?.email}</p>
            </td>
            <td className='px-6 py-4 align-top'>
                <p className='text-zinc-900'>{store.contact || "N/A"}</p>
                <p className='text-xs text-zinc-500'>{store.email}</p>
            </td>

            <td className='px-6 py-4 align-top'>
                <span
                    className={`
        inline-flex items-center
        px-3 py-1
        rounded-full
        text-xs font-medium
        ${store.isActive ? statusStyles.ACTIVE : statusStyles.INACTIVE}
    `}
                >
                    {store.isActive ? "Active" : "Inactive"}
                </span>
            </td>

            <td className='px-6 py-4 align-top'>
                <p className='font-medium text-zinc-900'>
                    {store.subscriptionPlan || "FREE"}
                </p>
                <p className='text-xs text-zinc-500'>
                    {store.subscriptionStatus || "EXPIRED"}
                </p>
            </td>
            <td className='px-6 py-4 align-top text-zinc-500'>
                {store.createdAt
                    ? new Date(store.createdAt).toLocaleDateString()
                    : "N/A"}
            </td>

            <td className='px-6 py-4 align-top'>
                {loading ? (
                    <InlineLoader content='' size='sm' />
                ) : (
                    <Button
                        size='sm'
                        variant={store.isActive ? "destructive" : "secondary"}
                        onClick={(event) => {
                            event.stopPropagation();
                            onToggleActivation(store._id, !store.isActive);
                        }}
                    >
                        {store.isActive ? "Deactivate" : "Activate"}
                    </Button>
                )}
            </td>
        </tr>
    );
};

export default StoreTableRow;
