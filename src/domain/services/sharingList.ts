import { axiosInstance } from "@/global/services/api/axiosInstance"
import { SharingCard, SharingSearchParams } from "@/global/types/sharing/sharingList";


export const getSharingList = (params:SharingSearchParams) => {
    return axiosInstance.get("/api/sharings", {params}).then(res => res.data);
}

export const getPopularSharingList = (params?:SharingSearchParams) => {
    return axiosInstance.get("/api/sharings/popular", {params}).then(res => res.data);
}

export const getInterestCount = () => {
  return axiosInstance.get("/api/sharings/countInterest").then(res => res.data);
};