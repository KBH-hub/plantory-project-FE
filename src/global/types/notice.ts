import type { NoticeTargetType } from "@/global/enum/noticeTypes";

export interface NoticeDTO {
  noticeId: number;   
  receiverId: number;
  targetType: NoticeTargetType;
  targetId: number;
  content: string;
  readFlag: string | null;
  createdAt: string;
  delFlag: string | null;
}