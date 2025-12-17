import { axiosInstance } from "@/global/services/api/axiosInstance";
import type { MessageListResponse, MessageSearchRequest, MessageDetailResponse } from "@/domain/message/types/message";

export const getMessageList = async ({
  boxType,
  offset,
  limit,
  targetType,
  title,
}: MessageSearchRequest): Promise<MessageListResponse> => {
  const res = await axiosInstance.get(`/api/message/${boxType}`, {
    params: { offset, limit, targetType, title },
  });
  return res.data;
};

export const getMessageDetail = async (messageId: number): Promise<MessageDetailResponse> => {
  const res = await axiosInstance.get(`/api/message/detail/${messageId}`);
  return res.data;
};
