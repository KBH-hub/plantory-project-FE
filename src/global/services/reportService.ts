import { axiosInstance } from "@/global/services/api/axiosInstance";

export const searchUserByNickname = async (nickname: string) => {
    const res = await axiosInstance.get("/api/report/users", {
        params:{nickname}
    });
    console.log(res.data);
    return res.data;
}