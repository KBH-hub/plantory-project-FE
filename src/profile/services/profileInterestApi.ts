import { axiosInstance } from "@/global/services/api/axiosInstance";
import { ProfileInterestResponse, ProfileInterestParams } from "@/profile/types/profileInterest";


export const getProfileInterestList = async ( params: ProfileInterestParams ): Promise<ProfileInterestResponse[]> => {
  const res = await axiosInstance.get<ProfileInterestResponse[]>("/api/profileInterest",
    { params }
  );
  return res.data;
};