import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import { ReviewRequest, ReviewInfoResponse } from "@/community/sharing/types/updateReviewType";

export const registerSharingReview = async ( sharingId: number, review: ReviewRequest ): Promise<boolean> => {
  return (await axiosInstance.post<boolean>( `/api/sharings/${sharingId}/review`, review)).data;
};

export const getSharingReviewInfo = async ( sharingId: number ): Promise<ReviewInfoResponse> => {
  return (await axiosInstance.get<ReviewInfoResponse>( `/api/sharings/${sharingId}/reviewInfo` )).data;
};