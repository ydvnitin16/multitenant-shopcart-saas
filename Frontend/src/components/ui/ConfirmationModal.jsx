import { X } from "lucide-react";
import Button from "./Button";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
}) => {
    if (!isOpen) return null;

    return (
        <div className='fixed h-screen inset-0 z-50 flex items-center justify-center'>
            <div
                onClick={onClose}
                className='absolute inset-0 bg-black/40 backdrop-blur-smr'
            />

            <div className='relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-zinc-200 p-6 space-y-6'>
                <div className='flex justify-between items-start'>
                    <div>
                        <h2 className='text-lg font-semibold text-zinc-900'>
                            {title}
                        </h2>
                        <p className='text-sm text-zinc-500 mt-1'>
                            {description}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className='text-zinc-400 hover:text-zinc-700 transition cursor-pointe'
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className='flex justify-end gap-3'>
                    <Button variant='secondary' onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant='primary'
                        className={"bg-emerald-500"}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
