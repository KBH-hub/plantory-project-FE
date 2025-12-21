export type SignUpRequest = {
    membername: string;
    nickname: string;
    phone: string;
    password: string;
    address: string;
};

export type UpdateMemberRequest = {
    nickname?: string;
    phone?: string;
    address?: string;
    password?: string;
};