import { axiosInstance } from "@/global/services/api/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";


const { user } = useAuthStore.getState();
export const getNoticeList = async () => {
  const memberId = user?.membername; 
  const res = await axiosInstance.get(`/api/notice`);
  return res.data;
};