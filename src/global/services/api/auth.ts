import { authAxios } from "@/global/services/api/authAxios";

export const loginApi = (payload: { membername: string; password: string }) =>
    authAxios.post("/api/auth/login", payload);

export const logoutApi = () => authAxios.post("/api/auth/logout");

export const meApi = () => authAxios.get("/api/auth/me");

export const reissueApi = () => authAxios.post("/api/auth/reissue");
