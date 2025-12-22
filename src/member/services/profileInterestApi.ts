import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import { ProfileInterestResponse, ProfileInterestParams } from "@/member/types/profileInterestType";


export const getProfileInterestList = async ( params: ProfileInterestParams ): Promise<ProfileInterestResponse[]> => {
  const res = await axiosInstance.get<ProfileInterestResponse[]>("/api/profileInterest",
    { params }
  );
  return res.data;
};