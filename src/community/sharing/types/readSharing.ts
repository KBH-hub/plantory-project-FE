import { Image } from "@/global/types/image";
import { ManageDemand, ManageLevel } from "../enum/manageTypes";

export interface SharingDetailResponse {
  sharingId: number;
  memberId: number;
  targetMemberId: number | null;
  nickname: string;
  sharingRate: number;

  title: string;
  content: string;
  plantType: string;
  managementLevel: ManageLevel;
  managementNeeds: ManageDemand;

  managementLevelLabel?: string;
  managementNeedsLabel?: string;

  interestNum: number;
  status: string; 

  createdAt: string;
  updatedAt?: string;

  images: Image[];
  interested: boolean;

  reviewFlag: string | null;
  receiverReviewFlag: string | null;
}

export interface SharingCommentResponse {
  commentId: number;
  writerId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}