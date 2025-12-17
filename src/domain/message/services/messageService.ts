import { axiosInstance } from "@/global/services/api/axiosInstance";
import type { MessageListResponse, MessageSearchRequest, MessageDetailResponse } from "@/domain/message/types/message";
import { BoxType } from "../enum/messageTypes";

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

export async function deleteSelectedMessages(boxType: BoxType, ids: number[]) {
  const endpoint =
    boxType === "SENT"
      ? "/api/message/deleteSenderMessages"
      : "/api/message/deleteMessages";

  await axiosInstance.delete(endpoint, { data: ids });
}

export const getMessageDetail = async (messageId: number): Promise<MessageDetailResponse> => {
  const res = await axiosInstance.get(`/api/message/detail/${messageId}`);
  return res.data;
};
