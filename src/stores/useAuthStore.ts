// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  memberId: number;
  membername: string;
  role: string;
}
interface AuthState {
  isLogin: boolean;
  user: User | null;
  accessToken: string | null; // 메모리 보관
  login: (p: { user: User; accessToken: string }) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLogin: false,
      user: null,
      accessToken: null,

      login: ({ user, accessToken }) =>
        set({ isLogin: true, user, accessToken }),

      // refresh 응답에는 user가 없으므로 기존 user 유지
      setAccessToken: (token) =>
        set({ isLogin: true, user: get().user, accessToken: token }),

      logout: () => set({ isLogin: false, user: null, accessToken: null }),
    }),
    {
      name: "auth-store",
      // 보안상 accessToken은 저장하지 않음(메모리만). user/isLogin만 영구화
      partialize: (state) => ({ isLogin: state.isLogin, user: state.user }),
    }
  )
);
