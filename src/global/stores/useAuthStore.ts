import { create } from "zustand";
import {meApi} from "@/global/services/authApi";

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
    profileImageUrl: string | null;
    stopDay: string | null;
}

interface AuthState {
    isLogin: boolean;
    authUser: AuthUser | null;
    user: User | null;
    accessToken: string | null;
    initialized: boolean;
    refreshMe: () => Promise<void>;


    login: (payload: { authUser: AuthUser; accessToken: string; user: User }) => void;
    initFromMe: (payload: { user: User; accessToken: string }) => void;

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

    refreshMe: async () => {
        const { data } = await meApi();
        set((state) => ({
            ...state,
            isLogin: true,
            authUser: {
                memberId: data.user.memberId,
                membername: data.user.membername,
                role: data.user.role,
            },
            user: data.user,
            accessToken: data.accessToken,
        }));
    },

    initFromMe: ({ user, accessToken }) =>
        set({
            isLogin: true,
            user,
            authUser: {
                memberId: user.memberId,
                membername: user.membername,
                role: user.role,
            },
            accessToken,
        }),

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
