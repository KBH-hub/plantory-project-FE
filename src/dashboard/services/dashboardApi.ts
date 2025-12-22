import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import type { DashboardResponse } from "@/dashboard/types/dashboardType";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const res = await axiosInstance.get("/api/dashboard");
  return res.data;
};
