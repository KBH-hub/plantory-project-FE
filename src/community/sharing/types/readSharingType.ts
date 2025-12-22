import { ImageType } from "@/global/types/imageType";
import { ManageDemand, ManageLevel } from "@/community/sharing/enum/manageTypes";

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

  images: ImageType[];
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

export interface DictionarySearchItem {
  id: string;           // cntntsNo
  plantName: string;    // cntntsSj
  fileUrl: string;      
  type: "garden" | "dry";
}

export interface DictionaryPlantDetail {
  plantName: string;

  manageLevel: ManageLevel;
  levelLabel: string;

  manageDemand: ManageDemand;
  demandLabel: string;

  fileUrl: string;
}
