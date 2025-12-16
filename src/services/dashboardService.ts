import { axiosInstance } from "../api/axiosInstance";

export type RecommendedSharing = {
  sharingId: number;
  title: string;
  status: string; 
  createdAt: string;
  interestNum: number;
  commentCount: number;
  fileUrl: string;
};

export type DashboardResponse = {
  myPlantsCount: number;
  todayWateringCount: number;
  careNeededCount: number;
  recommendeds: RecommendedSharing[];
  waterings: any[]; 
  diaries: any[];
};

export const getDashboard = async (): Promise<DashboardResponse> => {
  const res = await axiosInstance.get("/api/dashboard");
  return res.data;
};
