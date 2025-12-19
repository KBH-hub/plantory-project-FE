import { create } from "zustand";
export type Role = 'USER' | 'ADMIN';

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

    login: (payload: {
        authUser: AuthUser;
        accessToken: string;
    }) => void;

    setUser: (user: User) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
    setInitialized: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
    isLogin: false,
    authUser: null,
    user: null,
    accessToken: null,
    initialized: false,

    login: ({ authUser, accessToken }) =>
        set({
            isLogin: true,
            authUser,
            accessToken,
            initialized: true,
        }),

    setUser: (user) =>
        set((state) => ({
            ...state,
            user,
            isLogin: true,
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
