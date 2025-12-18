import { axiosInstance } from "@/global/services/api/axiosInstance";
import { SharingDetailResponse } from "../types/readSharing";
import { SharingCommentResponse } from "../types/readSharing";

export const getSharingDetail = async ( sharingId: number ): Promise<SharingDetailResponse> => {
    return ((await axiosInstance.get<SharingDetailResponse>(`/api/sharings/${sharingId}`)).data)
}

export const getSharingComments = async ( sharingId: number ): Promise<SharingCommentResponse[]> => {
  return ((await axiosInstance.get<SharingCommentResponse[]>( `/api/sharings/${sharingId}/comments`)).data);
};

export const addSharingComments = async ( sharingId: number, content: string ): Promise<boolean> => {
  return ((await axiosInstance.post<boolean>( `/api/sharings/${sharingId}/comments`, {content})).data);
};

export const updateSharingComments = async ( commentId: number, content: string ): Promise<boolean> => {
  return ((await axiosInstance.put<boolean>( `/api/sharings/comments/${commentId}`, {content})).data);
};

export const deleteSharingComments = async ( commentId: number ): Promise<boolean> => {
  return ((await axiosInstance.delete<boolean>( `/api/sharings/comments/${commentId}`)).data);
};

