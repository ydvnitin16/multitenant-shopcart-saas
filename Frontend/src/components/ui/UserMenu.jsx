import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutDashboard, Store, LogOutIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

const UserMenu = ({ user, onLogout }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    // Close when clicked outside
    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const initials = user.name[0].toUpperCase(); // Get first letter of name as avatar fallback

    // Logout confirmation state
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    return (
        <div className='relative' ref={menuRef}>
            {/* Avatar Badge */}
            <button
                onClick={() => setOpen(!open)}
                className='w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm hover:opacity-90 transition cursor-pointer'
            >
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt='avatar'
                        className='w-full h-full object-cover rounded-full'
                    />
                ) : (
                    initials
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className='absolute right-0 mt-3 w-64 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 space-y-4'>
                    {/* User Info */}
                    <div>
                        <p className='font-semibold text-zinc-800'>
                            {user.name}
                        </p>
                        <p className='text-xs text-zinc-500'>{user.email}</p>
                        <span className='inline-block mt-2 text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full capitalize'>
                            {user.role}
                        </span>
                    </div>

                    <div className='border-t border-zinc-300 pt-3 space-y-2 text-sm'>
                        {user.role === "VENDOR" && (
                            <Link
                                to='/store'
                                className='flex items-center gap-2 text-zinc-600 hover:text-emerald-600 transition'
                            >
                                <Store size={16} />
                                Vendor Dashboard
                            </Link>
                        )}

                        {user.role === "ADMIN" && (
                            <Link
                                to='/admin/dashboard'
                                className='flex items-center gap-2 text-zinc-600 hover:text-emerald-600 transition'
                            >
                                <LayoutDashboard size={16} />
                                Admin Panel
                            </Link>
                        )}

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className='flex items-center gap-2 text-red-500 hover:opacity-80 transition cursor-pointer'
                        >
                            <LogOutIcon />
                            Logout
                        </button>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                title='Logout'
                description='Are you sure you want to logout from your account?'
                confirmText='Logout'
                onConfirm={() => {
                    console.log("Logging out...");
                    setShowLogoutModal(false);
                    onLogout();
                }}
            />
        </div>
    );
};

export default UserMenu;
