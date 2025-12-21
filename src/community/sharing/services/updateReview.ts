import { axiosInstance } from "@/global/services/api/axiosInstance";
import { ReviewRequest, ReviewInfoResponse } from "@/community/sharing/types/updateReview";

export const registerSharingReview = async ( sharingId: number, review: ReviewRequest ): Promise<boolean> => {
  return (await axiosInstance.post<boolean>( `/api/sharings/${sharingId}/review`, review)).data;
};

export const getSharingReviewInfo = async ( sharingId: number ): Promise<ReviewInfoResponse> => {
  return (await axiosInstance.get<ReviewInfoResponse>( `/api/sharings/${sharingId}/reviewInfo` )).data;
};