import Button from "@/components/ui/Button";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusUI = {
    PENDING: {
        icon: <Clock size={28} className='text-amber-500' />,
        badge: "bg-amber-100 text-amber-700",
        title: "Request Under Review",
        description:
            "Your store request is currently under review. Our team will verify your details and notify you once approved.",
    },
    APPROVED: {
        icon: <CheckCircle2 size={28} className='text-emerald-600' />,
        badge: "bg-emerald-100 text-emerald-700",
        title: "Store Approved",
        description:
            "Congratulations! Your store has been approved and is now live on the platform. Please login again if you are unable to access store dashboard",
    },
    REJECTED: {
        icon: <XCircle size={28} className='text-red-600' />,
        badge: "bg-red-100 text-red-700",
        title: "Request Rejected",
        description:
            "Unfortunately, your store request was rejected. Please review your details and try again.",
    },
};

const StoreStatusCard = ({ request }) => {
    const current = statusUI[request.status];
    const navigate = useNavigate();

    return (
        <>
            <div className='bg-white border border-zinc-200 rounded-2xl shadow-sm p-8 space-y-6'>
                {/* Header */}
                <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className='p-3 rounded-xl bg-zinc-100 text-zinc-700'>
                            {current.icon}
                        </div>

                        <div>
                            <h1 className='text-xl font-semibold text-zinc-900'>
                                {current.title}
                            </h1>
                            <p className='text-sm text-zinc-500 mt-1'>
                                Submitted on {request.submittedAt}
                            </p>
                        </div>
                    </div>

                    <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${current.badge}`}
                    >
                        {request.status}
                    </span>
                </div>

                <p className='text-sm text-zinc-600 leading-relaxed'>
                    {current.description}
                </p>

                {/* Store Info Card */}
                <div className='bg-zinc-50 border border-zinc-200 rounded-xl p-6 space-y-5'>
                    <h3 className='text-sm font-semibold text-zinc-800'>
                        Store Information
                    </h3>

                    <div className='grid md:grid-cols-2 gap-y-5 gap-x-8 text-sm'>
                        <div>
                            <p className='text-zinc-500 mb-1'>Store Name</p>
                            <p className='font-medium text-zinc-900'>
                                {request.name}
                            </p>
                        </div>

                        <div>
                            <p className='text-zinc-500 mb-1'>Store Slug</p>
                            <p className='font-medium text-zinc-900'>
                                {request.slug}
                            </p>
                        </div>

                        <div>
                            <p className='text-zinc-500 mb-1'>Contact Email</p>
                            <p className='font-medium text-zinc-900'>
                                {request.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className='flex flex-wrap gap-3 pt-2'>
                    {request.status === "APPROVED" && (
                        <Button onClick={() => navigate("/store")} size='lg'>
                            Go to Dashboard
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default StoreStatusCard;
