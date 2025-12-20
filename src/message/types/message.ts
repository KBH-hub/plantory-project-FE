import { BoxType, TargetType } from "@/message/enum/messageTypes";

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

export interface MessageItemRequest {
  data: MessageListResponse[];
  selectedIds: number[];
  onToggleRow: (id: number, checked: boolean) => void;
  onRowClick: (messageId: number) => void;
}

export interface MessageSearchRequest {
  boxType: BoxType;
  offset: number;
  limit: number;
  targetType?: TargetType;
  title?: string;
  refreshKey? : number;
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
  targetType?: TargetType| null;
  targetId?: number | null;
  readFlag?: boolean | null;
};

export interface ReplyForm {
  to: string;
  post: string;
  title: string;
  content: string;
};


export interface MessageRegisterRequest {
  messageId?: number;
  senderId?: number;
  receiverId?: number;
  title?: string;
  content?: string;
  targetType?: TargetType;
  targetId?: number;
  createdAt?: Date;
  readFlag?: Date;
  delFlag?: Date;
}