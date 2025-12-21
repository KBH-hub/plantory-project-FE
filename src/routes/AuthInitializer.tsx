import { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { meApi } from "@/global/services/api/auth";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const initialized = useAuthStore((s) => s.initialized);

    useEffect(() => {
        const initAuth = async () => {
            const store = useAuthStore.getState();

            try {
                const { data } = await meApi();

                store.login({
                    authUser: {
                        memberId: data.user.memberId,
                        membername: data.user.membername,
                        role: data.user.role,
                    },
                    user: data.user,
                    accessToken: data.accessToken,
                });


                store.setUser(data.user);

                store.setInitialized(true);
            } catch (e) {
                if (axios.isAxiosError(e) && e.response?.status === 401) {
                    store.logout();
                    store.setInitialized(true);
                    return;
                }

                console.error("initAuth failed", e);
                store.logout();
                store.setInitialized(true);
            }
        };

        initAuth();
    }, []);

    if (!initialized) return <div>로딩중...</div>;
    return <>{children}</>;
}
