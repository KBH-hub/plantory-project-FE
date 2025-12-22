
import { ProfileSharingHistoryResponse, ProfileSharingHistoryParams } from "@/profile/types/sharingHistory";
import { axiosInstance } from "@/global/services/jjwt/axiosInstance";

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
