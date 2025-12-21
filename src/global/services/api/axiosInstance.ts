import axios from "axios";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { authAxios } from "@/global/services/api/authAxios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:9000",
    withCredentials: true,
});

const ALLOW_BEFORE_INIT = [
    "/api/auth/me",
    "/api/auth/reissue",
    "/api/auth/login",
    "/api/auth/logout",
];

axiosInstance.interceptors.request.use((config) => {
    const state = useAuthStore.getState();
    const url = config.url ?? "";

    const isAllowed = ALLOW_BEFORE_INIT.some((p) => url.includes(p));

    if (!state.initialized && !isAllowed) {
        const controller = new AbortController();
        controller.abort();
        config.signal = controller.signal;
        return config;
    }

    if (state.accessToken) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${state.accessToken}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (axios.isCancel(error) || error?.name === "CanceledError" || error?.name === "AbortError") {
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (!originalRequest) return Promise.reject(error);

        const url = originalRequest.url ?? "";
        const isAuthUrl = url.includes("/api/auth");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
            originalRequest._retry = true;

            try {
                const { data } = await authAxios.post("/api/auth/reissue");

                const store = useAuthStore.getState();
                store.setAccessToken(data.accessToken);

                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                return axiosInstance(originalRequest);
            } catch (reissueError) {
                const store = useAuthStore.getState();
                store.logout();
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
);
