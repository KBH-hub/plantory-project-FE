export type TabKey = "profilePosts" | "profileComments";
export type ChangePasswordReq = {
    oldPassword: string;
    newPassword: string;
};

export type ChangePasswordRes = {
    success: boolean;
};
export type CategoryKey =
    | "ALL"
    | "SHARING"
    | "QUESTION"
    | "COMMENT_ALL"
    | "COMMENT"
    | "ANSWER";

export type ProfileInfo = {
    memberId: number;
    membername: string;
    nickname: string;
    phone: string;
    address: string;
    role: string;
    noticeEnabled: number;
    sharingRate: number;
    delFlag: unknown | null;
    isMe?: boolean;
};

export type ProfilePictureRes = {
    imageUrl?: string | null;
};

export type ProfileWrittenItem = {
    id: number;
    nickname?: string | null;
    category: "SHARING" | "QUESTION" | "COMMENT" | "ANSWER" | string;
    title?: string | null;
    createdAt?: string | null;
    targetId?: number | null;
    targetCategory?: "SHARING" | "QUESTION" | null;
};


export type ProfileWrittenRes = {
    total: number;
    list: ProfileWrittenItem[];
};

export type ProfileCountsRes = {
    interestCount?: number | null;
    sharingCount?: number | null;
};
