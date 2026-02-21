import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "@/stores/useAuthStore";
import { logoutUser } from "../services/auth.api";

export const useLogout = () => {
    const navigate = useNavigate();
    const { clearAuth } = useAuthStore();

    const handleLogout = async () => {
        try {
            await logoutUser();
            clearAuth();
            toast.success("Logged out successfully");
            navigate("/user/login");
        } catch (err) {
            toast.error(err.message || "Logout failed");
        }
    };

    return { handleLogout };
};
