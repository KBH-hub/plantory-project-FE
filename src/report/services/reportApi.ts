import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import { reportMembers } from "@/report/types/reportType"

export const searchUserByNickname = async (nickname: string): Promise<reportMembers[]> => {
    const res = await axiosInstance.get("/api/report/users", {
        params: { nickname }
    });
    return res.data;
}

export async function registerReport(fd: FormData) {
  const res = await axiosInstance.post<{ message: string }>("/api/report", fd);
  return res.data;
}