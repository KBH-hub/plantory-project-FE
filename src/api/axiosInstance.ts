// src/api/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:9000/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE,          // ✅ /api 프리픽스 포함 (직결) 또는 .env로 /api(프록시)
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

// ===== 401 만료 처리 + 동시성 큐 =====
let isRefreshing = false;
let waitQueue: Array<(t?: string) => void> = [];

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    // ✅ 토큰 만료/부재는 401 기준으로 재발급
    if (status === 401 && original && !original._retry) {
      original._retry = true;

      // 누군가 갱신 중이면 큐에서 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          waitQueue.push((newToken?: string) => {
            if (!newToken) return reject(error);
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(original));
          });
        });
      }

      // 내가 갱신 담당
      isRefreshing = true;
      try {
        // ✅ 리프레시는 같은 인스턴스 금지(재귀 방지) + 쿠키 전송
        const refreshResp = await axios.post(
          API_BASE + "/auth/refresh",
          null,
          { withCredentials: true }
        );
        const newToken = (refreshResp.data as any)?.accessToken;

        // ✅ user 보존, 토큰만 갱신
        useAuthStore.getState().setAccessToken(newToken);

        // 대기 중인 요청들 재시도
        waitQueue.forEach((fn) => fn(newToken));
        waitQueue = [];
        isRefreshing = false;

        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      } catch (e) {
        // 실패: 모두 실패 통지 + 로그아웃
        waitQueue.forEach((fn) => fn(undefined));
        waitQueue = [];
        isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
