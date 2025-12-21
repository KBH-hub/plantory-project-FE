import {Navigate} from "react-router-dom";
import {useAuthStore} from "@/global/stores/useAuthStore";

function RootRedirectRoute() {
    const { isLogin, authUser, initialized } = useAuthStore();

    if (!initialized) return <div>로딩중...</div>;

    if (!isLogin) return <Navigate to="/login" replace />;

    if (authUser?.role === "ADMIN") {
        return <Navigate to="/admin/memberManagement" replace />;
    }

    return <Navigate to="/dashboard" replace />;
}

export default RootRedirectRoute;