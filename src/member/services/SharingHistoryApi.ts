import { axiosInstance } from "@/global/services/api/axiosInstance";
import { ProfileSharingHistoryResponse, ProfileSharingHistoryParams } from "@/member/types/sharingHistory";

export const getMySharingHistory = async ( params: ProfileSharingHistoryParams ): Promise<ProfileSharingHistoryResponse[]> => {
  const res = await axiosInstance.get<ProfileSharingHistoryResponse[]>(
    "/api/profileSharing/my",
    { params }
  );
  return res.data;
};

export const getReceivedSharingHistory = async ( params: ProfileSharingHistoryParams ): Promise<ProfileSharingHistoryResponse[]> => {
  const res = await axiosInstance.get<ProfileSharingHistoryResponse[]>(
    "/api/profileSharing/received",
    { params }
  );
  return res.data;
};
