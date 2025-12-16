import { BoxType, TargetType } from "./messageTypes";

export interface MessageListResponse {
  messageId: number;
  senderId: number;
  senderNickname: string;
  receiverId: number;
  receiverNickname: string;
  title: string;
  content: string;
  targetType: TargetType;
  targetTitle: string;
  createdAt: string;
  readFlag: boolean | null;
  delFlag: boolean | null;
  senderDelFlag: boolean | null;
  totalCount: number;
}

export interface MessageSearchRequest {
  memberId: number;
  boxType: BoxType;
  targetType?: TargetType;
  title?: string;
  offset: number;
  limit: number;
}

