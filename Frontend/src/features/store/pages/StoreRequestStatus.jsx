import { Megaphone } from "lucide-react";
import StoreStatusCard from "../components/StoreStatusCard";
import { useStores } from "../hooks/useStores";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";

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
                {/* NOTE */}
                <div className='flex items-center gap-2 text-green-600 bg-green-600/20 p-2 rounded-xl border border-green-300'>
                    <Megaphone size={18} />{" "}
                    <span>
                        {" "}
                        If its your first store, prefer re-login after store
                        approval to get access to ou store
                    </span>
                </div>
                {requests.length > 0 ? (
                    requests?.map((request) => (
                        <StoreStatusCard request={request} />
                    ))
                ) : (
                    <Link to={"/request-store"}>
                        <Button>Request a store</Button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default StoreRequestStatus;
