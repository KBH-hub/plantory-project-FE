import { axiosInstance } from "@/global/services/api/axiosInstance";
import { SharingDetailResponse, SharingCommentResponse } from "@/community/sharing/types/readSharing";

export const getSharingDetail = async ( sharingId: number ): Promise<SharingDetailResponse> => {
    return ((await axiosInstance.get<SharingDetailResponse>(`/api/sharings/${sharingId}`)).data)
};

export const getSharingComments = async ( sharingId: number ): Promise<SharingCommentResponse[]> => {
  return ((await axiosInstance.get<SharingCommentResponse[]>( `/api/sharings/${sharingId}/comments`)).data);
};

export const addSharingComments = async ( sharingId: number, content: string ): Promise<boolean> => {
  return ((await axiosInstance.post<boolean>( `/api/sharings/${sharingId}/comments`, {content})).data);
};

export const updateSharingComments = async ( sharingId: number, commentId: number, content: string ): Promise<boolean> => {
  return ((await axiosInstance.put<boolean>( `/api/sharings/${sharingId}/comments/${commentId}`, {content})).data);
};

export const deleteSharingComments = async ( sharingId: number, commentId: number ): Promise<boolean> => {
  return ((await axiosInstance.delete<boolean>( `/api/sharings/${sharingId}/comments/${commentId}`)).data);
};

export const addInterest = async ( sharingId: number): Promise<boolean> => {
  return ((await axiosInstance.post<boolean>(`/api/sharings/${sharingId}/interest`)).data);
}

export const removeInterest = async ( sharingId: number): Promise<boolean> => {
  return ((await axiosInstance.delete<boolean>(`/api/sharings/${sharingId}/interest`)).data);
}



