// src/types/message.ts
export type TargetType = "SHARING" | "QUESTION" | "REPORT" | "MYPLANT" | "DIARY";

export interface MessageItem {
  messageId: number;
  senderId: number;
  senderNickname: string;
  receiverId: number;
  receiverNickname: string;
  title: string;
  content: string;
  targetType: TargetType;
  targetTitle: string;
  createdAt: string;   // ISO string
  readFlag: boolean | null;       // 서버가 null을 줄 수 있으니 그대로 유지
  delFlag: boolean | null;
  senderDelFlag: boolean | null;
  totalCount: number;  // 페이징용 총 건수(아이템마다 중복 포함)
}

export interface MessagePage {
  items: MessageItem[];
  totalCount: number;
  offset: number;
  limit: number;
}
