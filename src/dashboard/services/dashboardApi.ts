import { axiosInstance } from "@/global/services/api/axiosInstance";
import type { DashboardResponse } from "@/dashboard/types/dashboard";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const res = await axiosInstance.get("/api/dashboard");
  return res.data;
};
