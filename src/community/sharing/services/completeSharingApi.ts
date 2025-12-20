import { axiosInstance } from "@/global/services/api/axiosInstance";
import { SharingPartner, ReviewRequest } from "@/community/sharing/types/completeSharing";

export const getSharingPartners = async ( sharingId: number, receiverId: number ): Promise<SharingPartner[]> => {
  const res = await axiosInstance.get<SharingPartner[]>(`/api/sharings/${sharingId}/partners`,
    {
      params: { receiverId },
    }
  );
  return res.data;
};

export const completeSharing = async ( sharingId: number, targetMemberId: number ): Promise<boolean> => {
  const res = await axiosInstance.post<boolean>( `/api/sharings/${sharingId}/complete`, null,
    {
      params: { targetMemberId },
    }
  );
  return res.data;
};

export const registerSharingReview = async ( sharingId: number, review: ReviewRequest ): Promise<boolean> => {
  return (await axiosInstance.post<boolean>( `/api/sharings/${sharingId}/review`, review)).data;
};
