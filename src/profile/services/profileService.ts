import { axiosInstance } from "@/global/services/api/axiosInstance";
import type {
    ChangePasswordReq, ChangePasswordRes,
    ProfileCountsRes,
    ProfileInfo,
    ProfilePictureRes,
    ProfileWrittenRes, UpdateProfileReq,
} from "@/profile/types/profileType.ts";

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

    getWritten: async (profileId: number, params: {
        keyword: string;
        category: string;
        limit: number;
        offset: number;
    }) => {
        const res = await axiosInstance.get<ProfileWrittenRes>(`/api/profileWritten/${profileId}`, { params });
        return res.data;
    },

    softDeleteWritten: async (payload: {
        memberId: number;
        sharingIds: number[];
        questionIds: number[];
    }) => {
        const res = await axiosInstance.post("/api/profileWritten/softDelete", payload);
        return res.data;
    },

    getCounts: async () => {
        const res = await axiosInstance.get<ProfileCountsRes>("/api/profileSharing/counts");
        return res.data;
    },


    updateMyProfile: async (payload: UpdateProfileReq) => {
        const res = await axiosInstance.put("/api/profile", payload);
        return res.data;
    },

    uploadMyPicture: async (file: File) => {
        const formData = new FormData();
        formData.append("profileImage", file);

        const res = await axiosInstance.post("/api/profile/picture", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    changePassword: async (payload: ChangePasswordReq) => {
        const res = await axiosInstance.put<ChangePasswordRes>("/api/profile/changePassword", payload);
        return res.data;
    },

    withdraw: async () => {
        const res = await axiosInstance.put("/api/profile/withdraw");
        return res.data;
    },
};
