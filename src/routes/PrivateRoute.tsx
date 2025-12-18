import { ReactNode } from "react";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";


export default function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isLogin = useAuthStore((s) => s.isLogin);

  if (!isLogin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
