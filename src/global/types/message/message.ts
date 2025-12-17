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

export interface GetMessageListParams {
  boxType: BoxType;
  offset: number;
  limit: number;
  targetType?: TargetType;
  title?: string;
}

export interface MessageDetailResponse {
  messageId: number;
  title: string;
  content: string;
  senderId: number;
  senderNickname: string;
  receiverId: number;
  receiverNickname: string;
  createdAt: string;
  targetTitle?: string;
  targetType?: string;
  readFlag?: boolean | null;
};

export interface ReplyForm {
  to: string;
  post: string;
  title: string;
  content: string;
};

