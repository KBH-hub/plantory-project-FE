import { axiosInstance } from "../api/axiosInstance";
import type { MessageListResponse, GetMessageListParams, MessageDetailResponse } from "../types/message/message";
import type { BoxType, TargetType } from "../types/message/messageTypes";

export const getMessageList = async ({
  boxType,
  offset,
  limit,
  targetType,
  title,
}: GetMessageListParams): Promise<MessageListResponse> => {
  const res = await axiosInstance.get(`/api/message/${boxType}`, {
    params: { offset, limit, targetType, title },
  });
  return res.data;
};

export const getMessageDetail = async (messageId: number): Promise<MessageDetailResponse> => {
  const res = await axiosInstance.get(`/api/message/detail/${messageId}`);
  return res.data;
};
