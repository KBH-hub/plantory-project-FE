import { axiosInstance } from "@/global/services/api/axiosInstance"
import { SharingCardListResponse, SharingSearchRequest } from "@/domain/sharing/types/sharingList";


export const getSharingList = (params:SharingSearchRequest) => {
    return axiosInstance.get("/api/sharings", {params}).then(res => res.data);
}

export const getPopularSharingList = (params?:SharingSearchRequest) => {
    return axiosInstance.get("/api/sharings/popular", {params}).then(res => res.data);
}

export const getInterestCount = () => {
  return axiosInstance.get("/api/sharings/countInterest").then(res => res.data);
};