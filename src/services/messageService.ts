import { axiosInstance } from "../api/axiosInstance";
import type { MessageListResponse } from "../types/message/message";
import type { BoxType, TargetType } from "../types/message/messageTypes";

export interface GetMessageListParams {
  boxType: BoxType;
  offset: number;
  limit: number;
  targetType?: TargetType;
  title?: string;
}

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
