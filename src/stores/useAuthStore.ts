import { create } from "zustand";

interface User {
    memberId: number;
    membername: string;
    role: string;
}

interface AuthState {
    /** 로그인 여부 */
    isLogin: boolean;

    /** 로그인 사용자 정보 */
    user: User | null;

    /** access token (메모리) */
    accessToken: string | null;

    /** 로그인 성공 */
    login: (payload: {
        user: User;
        accessToken: string;
    }) => void;

    /** access token 갱신 */
    setAccessToken: (token: string) => void;

    /** 로그아웃 */
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
        }),
}));
