import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuthStore } from "../stores/useAuthStore";

interface Props {
    children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
    const isLogin = useAuthStore((s) => s.isLogin);

    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
