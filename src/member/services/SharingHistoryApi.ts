import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import { ProfileSharingHistoryResponse, ProfileSharingHistoryParams } from "@/member/types/sharingHistoryType";

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
