import StoreStatusCard from "../components/StoreStatusCard";
import { useStores } from "../hooks/useStores";

const StoreRequestStatus = () => {
    const { stores: requests, loading, error } = useStores({ status: "ALL" });

    if (loading)
        return (
            <div className='min-h-screen flex items-center justify-center'>
                Loading...
            </div>
        );

    if (error)
        return (
            <div className='min-h-screen flex items-center justify-center text-red-600'>
                {error}
            </div>
        );

    return (
        <div className='min-h-screen bg-zinc-50 pt-28 px-6'>
            <div className='max-w-3xl flex flex-col gap-3 mx-auto'>
                {requests.map((request) => (
                    <StoreStatusCard request={request} />
                ))}
            </div>
        </div>
    );
};

export default StoreRequestStatus;
