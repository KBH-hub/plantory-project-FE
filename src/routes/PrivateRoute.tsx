// src/routes/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function PrivateRoute({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hydrated = useAuthStore.persist?.hasHydrated?.() ?? true; // persist 미사용 대비
  const isLogin = useAuthStore((s) => s.isLogin);

  if (!hydrated) return null; // 또는 로딩 스켈레톤 UI

  if (!isLogin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
