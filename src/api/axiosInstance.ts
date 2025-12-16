import axios from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (
          error.response?.status === 401 &&
          !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const { data } = await axiosInstance.post(
              "/api/auth/reissue"
          );

          useAuthStore.getState().setAccessToken(data.accessToken);

          originalRequest.headers.Authorization =
              `Bearer ${data.accessToken}`;

          return axiosInstance(originalRequest);
        } catch {
          useAuthStore.getState().logout();
        }
      }

      return Promise.reject(error);
    }
);
