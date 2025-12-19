import { useEffect } from "react";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { axiosInstance } from "@/global/services/api/axiosInstance";

export default function AuthInitializer({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const login = useAuthStore((s) => s.login);
    const setInitialized = useAuthStore((s) => s.setInitialized);
    const initialized = useAuthStore((s) => s.initialized);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await axiosInstance.get("/api/auth/me");
                login({
                    user: data.user,
                    accessToken: data.accessToken,
                });
            } catch {
                setInitialized();
            }
        };

        if (!initialized) {
            initAuth();
        }
    }, [initialized, login, setInitialized]);

    if (!initialized) {
        return <div>로딩중...</div>;
    }

    return <>{children}</>;
}
