import type { UseBoundStore } from "zustand";
import type { AuthState } from "@/features/auth/store/authStore";

declare global {
    interface Window {
        authStore?: UseBoundStore<AuthState>;
    }
}

export {};
