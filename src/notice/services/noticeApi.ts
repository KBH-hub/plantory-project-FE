import { axiosInstance } from "@/global/services/jjwt/axiosInstance";



export const getNoticeList = async () => {
  const res = await axiosInstance.get(`/api/notice`);
  return res.data;
};

export async function markNoticeRead(noticeId: number): Promise<void> {
  await axiosInstance.put("/api/notice", null, {
    params: { noticeId },
  });
}

export function removeAllNotice(){
  axiosInstance.delete("/api/notice");
}