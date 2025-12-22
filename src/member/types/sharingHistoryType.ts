export interface ProfileSharingHistoryResponse {
  sharingId: number;
  targetMemberId: number | null;
  title: string;
  status: "true" | "false";
  interestNum: number;
  createdAt: string;
  reviewFlag: string | null;
  targetMemberReviewFlag: string | null;
  commentCount: number;
  thumbnail: string | null;
  totalCount: number;
}

export type ProfileSharingTab = "MY" | "RECEIVED";

export interface ProfileSharingHistoryParams {
  keyword?: string;
  status?: string;
  offset: number;
  limit: number;
}
