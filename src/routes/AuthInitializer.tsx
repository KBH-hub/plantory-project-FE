import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/api/axiosInstance";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await axiosInstance.post("/api/auth/reissue");
                login({
                    user: data.user,
                    accessToken: data.accessToken,
                });
            } catch {
                logout();
            } finally {
                setInitialized(true);
            }
        };

        initAuth();
    }, []);

    if (!initialized) {
        return <div>로딩중...</div>; // 또는 스피너
    }

    return <>{children}</>;
}
