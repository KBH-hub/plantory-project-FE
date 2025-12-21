import { Navigate } from "react-router-dom";
import { useAuthStore, Role } from "@/global/stores/useAuthStore";

export default function RoleRoute({ allow, children }: { allow: Role[]; children: React.ReactNode }) {
    const role = useAuthStore((s) => s.authUser?.role);
    const initialized = useAuthStore((s) => s.initialized);
    if (!initialized) return <div>로딩중...</div>;
    if (!role) return <Navigate to="/login" replace />;
    if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
}
