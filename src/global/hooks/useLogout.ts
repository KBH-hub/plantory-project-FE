import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { logoutApi } from "@/global/services/authApi";

export default function useLogout() {
    const navigate = useNavigate();

    return async function handleLogout() {
        try {
            await logoutApi();
        } catch (e) {
            console.warn("logout api failed (ignoreable)", e);
        } finally {
            const store = useAuthStore.getState();
            store.logout();

            navigate("/login", { replace: true });
        }
    };
}
