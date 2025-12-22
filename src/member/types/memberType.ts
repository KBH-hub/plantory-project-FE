export type SignUpRequest = {
    membername: string;
    nickname: string;
    phone: string;
    password: string;
    address: string;
};

export type MemberFormValues = {
    membername: string;
    nickname: string;
    phone: string;
    address: string;
    password: string;
    pwCheck: string;
    noticeEnabled: boolean;
};