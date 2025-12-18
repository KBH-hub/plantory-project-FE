import { axiosInstance } from "@/global/services/api/axiosInstance";
import { SharingDetailResponse } from "../types/readSharing";
import { SharingCommentResponse } from "../types/readSharing";

export const getSharingDetail = async ( sharingId: number ): Promise<SharingDetailResponse> => {
    return ((await axiosInstance.get<SharingDetailResponse>(`/api/sharings/${sharingId}`)).data)
}

export const getSharingComments = async ( sharingId: number ): Promise<SharingCommentResponse[]> => {
  return ((await axiosInstance.get<SharingCommentResponse[]>( `/api/sharings/${sharingId}/comments`)).data);
};