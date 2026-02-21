import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import toast from "react-hot-toast";

const normalizeRole = (role) => (role || "").toUpperCase();

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const location = useLocation();
    const { currentUser, isAuthenticated, clearAuth } = useAuthStore();

    const authenticated = isAuthenticated();
    if (!authenticated) {
        clearAuth(); // clear stale persisted session
        return <Navigate to='/user/login' replace state={{ from: location }} />;
    }

    if (allowedRoles.length > 0) {
        const userRole = normalizeRole(currentUser?.role);
        const canAccess = allowedRoles.map(normalizeRole).includes(userRole);

        if (!canAccess) return <Navigate to='/' replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
