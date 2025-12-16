// src/api/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:9000/api";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
  timeout: 10000,
});

// 요청 인터셉터: 액세스 토큰 자동 첨부
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && !(config as any).skipAuth) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;

        const { data } = await axiosInstance.post("/api/token", {
          refreshToken,
        });

        useAuthStore.setState({
          accessToken: data.accessToken,
        });

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch {
        useAuthStore.setState({
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      }
    }

    return Promise.reject(error);
  }
);
