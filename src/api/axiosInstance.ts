import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { authAxios } from "@/api/authAxios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
    const state = useAuthStore.getState();
    const url = config.url ?? "";

    const isAuthApi =
        url.includes("/api/auth/me") ||
        url.includes("/api/auth/reissue");

    if (!state.initialized && !isAuthApi) {
        return Promise.reject(new axios.Cancel("Auth not initialized"));
    }

    if (state.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
    }

    return config;
});


axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
        // ⭐ Cancel된 요청은 그냥 종료
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/api/auth")
        ) {
            originalRequest._retry = true;

            try {
                const { data } = await authAxios.post("/api/auth/reissue");

                useAuthStore.getState().setAccessToken(data.accessToken);

                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization =
                    `Bearer ${data.accessToken}`;

                return axiosInstance(originalRequest);
            } catch (e) {
                console.error("reissue 실패", e);
            }
        }

        return Promise.reject(error);
    }
);

