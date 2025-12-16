import { axiosInstance } from "../api/axiosInstance";
import type { DashboardResponse } from "../types/dashboard";

export const getDashboard = async (): Promise<DashboardResponse> => {
  const res = await axiosInstance.get("/api/dashboard");
  return res.data;
};
