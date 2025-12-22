export interface ProfileInterestResponse {
  sharingId: number;
  title: string;
  status: "true" | "false";
  interestNum: number;
  createdAt: string;
  commentCount: number;
  thumbnail: string | null;
  totalCount: number;
}

export interface ProfileInterestParams {
  keyword?: string;
  offset: number;
  limit: number;
}
