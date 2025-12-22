import { axiosInstance } from "@/global/services/jjwt/axiosInstance"
import { SharingCardListResponse, SharingSearchRequest } from "@/community/sharing/types/sharingListType";

export const getSharingList = async (params:SharingSearchRequest) : Promise<SharingCardListResponse[]> => {
  return (await axiosInstance.get<SharingCardListResponse[]>("/api/sharings", {params})).data;
}

export const getPopularSharingList = async (params?:SharingSearchRequest) : Promise<SharingCardListResponse[]> => {
  return (await axiosInstance.get<SharingCardListResponse[]>("/api/sharings/popular", {params})).data;
}

export const getInterestCount = async () : Promise<number> => {
  return (await axiosInstance.get<number>("/api/sharings/countInterest")).data;
}

