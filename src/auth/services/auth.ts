import { axiosInstance } from "@/global/services/api/axiosInstance";
export async function logoutApi() {
    return axiosInstance.post("/api/auth/logout");
}
