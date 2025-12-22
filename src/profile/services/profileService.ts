import { axiosInstance } from "@/global/services/jjwt/axiosInstance";

import type {
    ChangePasswordReq,
    ChangePasswordRes,
    ProfileCountsRes,
    ProfileInfo,
    ProfilePictureRes,
    ProfileWrittenRes,
    UpdateProfileReq,
} from "@/profile/types/profileType";

export const profileApi = {
    getMyProfile: async () => {
        const res = await axiosInstance.get<ProfileInfo>("/api/profile/me");
        return res.data;
    },

    getPublicProfile: async (profileId: number) => {
        const res = await axiosInstance.get<ProfileInfo>(`/api/profile/publicProfile/${profileId}`);
        return res.data;
    },

    getPicture: async (memberId: number) => {
        const res = await axiosInstance.get<ProfilePictureRes>("/api/profile/picture", {
            params: { memberId },
        });
        return res.data;
    },

    getWritten: async (
        profileId: number,
        params: { keyword: string; category: string; limit: number; offset: number }
    ) => {
        const res = await axiosInstance.get<ProfileWrittenRes>(`/api/profileWritten/${profileId}`, { params });
        return res.data;
    },

    softDeleteWritten: async (payload: { memberId: number; sharingIds: number[]; questionIds: number[] }) => {
        const res = await axiosInstance.post("/api/profileWritten/softDelete", payload);
        return res.data;
    },

    getCounts: async () => {
        const res = await axiosInstance.get<ProfileCountsRes>("/api/profileSharing/counts");
        return res.data;
    },

    updateProfile: async (payload: UpdateProfileReq) => {
        const res = await axiosInstance.put("/api/profile", payload);
        return res.data;
    },

    uploadProfileImage: async (file: File) => {
        const formData = new FormData();
        formData.append("profileImage", file);

        const res = await axiosInstance.post("/api/profile/picture", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    checkNickname: (nickname: string) =>
        axiosInstance.get("/api/members/checkNickname", { params: { nickname } }).then(r => !r.data.exists),

    changePassword: async (payload: ChangePasswordReq) => {
        const res = await axiosInstance.put<ChangePasswordRes>("/api/profile/changePassword", payload);
        return res.data;
    },

    withdraw: async () => {
        const res = await axiosInstance.put("/api/profile/withdraw");
        return res.data;
    },
};