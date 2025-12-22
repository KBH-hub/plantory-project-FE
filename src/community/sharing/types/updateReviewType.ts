export interface ReviewRequest {
  manner: number;
  reShare: number;
  satisfaction: number | null;
}

export type ReviewerType = "RECEIVER" | "GIVER";

export interface ReviewInfoResponse {
  sharingId: number;
  partnerId: number;
  partnerNickname: string;
  title: string;
  createdAt: string;
  reviewerType: ReviewerType;
}
