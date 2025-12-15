// src/services/message.service.ts
import { axiosInstance } from "../api/axiosInstance";
import { MessageItem, MessagePage, TargetType } from "../types/message";

export type BoxType = "RECEIVED" | "SENT";

export interface MessageListParams {
  targetType?: TargetType;
  offset?: number;
  limit?: number;
  signal?: AbortSignal; // 선택: 취소를 위해
}

function cleanParams<T extends Record<string, any>>(obj: T): Record<string, any> {
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) out[k] = v;
  });
  return out;
}

function normalizeItems(items: MessageItem[]): MessageItem[] {
  return (items ?? []).map((m) => ({
    ...m,
    // 표시 편의: null을 false로
    readFlag: (m.readFlag ?? false) as boolean,
    delFlag: (m.delFlag ?? false) as boolean,
    senderDelFlag: (m.senderDelFlag ?? false) as boolean,
  }));
}

export const MessageService = {
  async listByBox(
    memberId: number,
    box: BoxType,
    { targetType, offset = 0, limit = 10, signal }: MessageListParams = {}
  ): Promise<MessagePage> {
    // 서버가 배열을 주는 현 스펙
    const { data } = await axiosInstance.get<MessageItem[]>(
      `/message/${memberId}/${box}`,
      {
        params: cleanParams({ targetType, offset, limit }),
        signal,
      }
    );

    const items = normalizeItems(data ?? []);
    const totalCount = items.length > 0 ? items[0].totalCount : 0;

    return { items, totalCount, offset, limit };
  },

  // (선택) 서버가 페이지 객체로 응답하는 경우를 대비한 유연 버전
  async listByBoxFlexible(
    memberId: number,
    box: BoxType,
    { targetType, offset = 0, limit = 10, signal }: MessageListParams = {}
  ): Promise<MessagePage> {
    const res = await axiosInstance.get<
      MessageItem[] | { items: MessageItem[]; totalCount: number }
    >(`/message/${memberId}/${box}`, {
      params: cleanParams({ targetType, offset, limit }),
      signal,
    });

    if (Array.isArray(res.data)) {
      const items = normalizeItems(res.data);
      const totalCount = items.length > 0 ? items[0].totalCount : 0;
      return { items, totalCount, offset, limit };
    } else {
      const items = normalizeItems(res.data.items);
      return { items, totalCount: res.data.totalCount ?? res.data.items[0]?.totalCount ?? 0, offset, limit };
    }
  },
};
