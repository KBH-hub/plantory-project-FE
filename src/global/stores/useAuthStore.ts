import { create } from "zustand";

export type Role = "USER" | "ADMIN";

export interface AuthUser {
    memberId: number;
    membername: string;
    role: Role;
}

export interface User extends AuthUser {
    nickname: string;
    phone: string;
    address: string;
    sharingRate: number | null;
    skillRate: number | null;
    managementRate: number | null;
    stopDay: string | null;
}

interface AuthState {
    isLogin: boolean;
    authUser: AuthUser | null;
    user: User | null;
    accessToken: string | null;
    initialized: boolean;

    login: (payload: { authUser: AuthUser; accessToken: string; user: User }) => void;

    setUser: (user: User | null) => void;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
    setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLogin: false,
    authUser: null,
    user: null,
    accessToken: null,
    initialized: false,

    login: ({ authUser, accessToken, user }) =>
        set({
            isLogin: true,
            authUser,
            user,
            accessToken,
        }),

    setUser: (user) =>
        set((state) => ({
            ...state,
            user,
            isLogin: !!user,
        })),

    setAccessToken: (token) =>
        set((state) => ({
            ...state,
            accessToken: token,
        })),

    logout: () =>
        set({
            isLogin: false,
            authUser: null,
            user: null,
            accessToken: null,
            // initialized는 AuthInitializer가 관리 (건드리지 않음)
        }),

    setInitialized: (initialized) => set({ initialized }),
}));

if (import.meta.env.DEV) {
    window.authStore = useAuthStore;
}
