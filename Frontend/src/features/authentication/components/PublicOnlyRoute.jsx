import useAuthStore from "@/stores/useAuthStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicOnlyRoute = () => {
    const { isAuthenticated, currentUser } = useAuthStore();

    if (!isAuthenticated()) {
        return <Outlet />;
    }

    const role = (currentUser?.role || "").toUpperCase();

    if (role === "ADMIN") return <Navigate to='/admin/dashboard' replace />;
    if (role === "VENDOR") return <Navigate to='/store' replace />;
    return <Navigate to='/' replace />;
};

export default PublicOnlyRoute;
