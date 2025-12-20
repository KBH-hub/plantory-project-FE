import type { NoticeTargetType } from "@/global/enum/noticeTypes";

export interface notice {
  noticeId: number;   
  receiverId: number;
  targetType: NoticeTargetType;
  targetId: number;
  content: string;
  readFlag: string | null;
  createdAt: string;
  href:string;
  delFlag: string | null;
}