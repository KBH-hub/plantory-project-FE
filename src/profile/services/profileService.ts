import { axiosInstance } from "@/global/services/api/axiosInstance";
import type {
    ProfileCountsRes,
    ProfileInfo,
    ProfilePictureRes,
    ProfileWrittenRes,
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
};
