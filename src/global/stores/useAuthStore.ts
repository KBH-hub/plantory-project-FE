import { create } from "zustand";

interface User {
  memberId: number;
  membername: string;
  role: string;
}
interface AuthState {
    isLogin: boolean;
    user: User | null;
    accessToken: string | null;
    initialized: boolean;
    login: (payload: {
        user: User;
        accessToken: string;
    }) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
    setInitialized: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLogin: false,
    user: null,
    accessToken: null,
    initialized: false,

    login: ({ user, accessToken }) =>
        set({
            isLogin: true,
            user,
            accessToken,
            initialized: true,
        }),

    setAccessToken: (token) =>
        set((state) => ({
            ...state,
            isLogin: true,
            accessToken: token,
        })),

    logout: () =>
        set({
            isLogin: false,
            user: null,
            accessToken: null,
            initialized: true,
        }),

    setInitialized: () =>
        set({ initialized: true }),
}));

/**
 * 개발용 디버깅 배포 시 지우기.
 */
if (import.meta.env.DEV) {
    window.authStore = useAuthStore;
}
