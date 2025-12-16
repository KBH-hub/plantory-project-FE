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
    login: (payload: {
        user: User;
        accessToken: string;
    }) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLogin: false,
    user: null,
    accessToken: null,

    login: ({ user, accessToken }) =>
        set({
            isLogin: true,
            user,
            accessToken,
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
        })
}));

