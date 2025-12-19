import { useEffect } from "react";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { axiosInstance } from "@/global/services/api/axiosInstance";

export default function AuthInitializer({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const initialized = useAuthStore((s) => s.initialized);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data } = await axiosInstance.get("/api/auth/me");

                useAuthStore.getState().login({
                    authUser: {
                        memberId: data.user.memberId,
                        membername: data.user.membername,
                        role: data.user.role,
                    },
                    accessToken: data.accessToken,
                });

                useAuthStore.getState().setUser(data.user);

            } catch (e) {
                console.error(e);
                useAuthStore.getState().setInitialized();
            }
        };

        initAuth();
    }, []);


    if (!initialized) {
        return <div>로딩중...</div>;
    }

    return <>{children}</>;
}
