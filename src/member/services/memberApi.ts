import {SignUpRequest} from "@/member/types/memberType";
import {axiosInstance} from "@/global/services/jjwt/axiosInstance";

export const signUp = (data: SignUpRequest) => {
    return axiosInstance.post("/api/members/signUp", data);
};

export const checkMembernameApi = async (
    membername: string
): Promise<boolean> => {
    const { data } = await axiosInstance.get<{
        exists: boolean;
    }>("/api/members/checkMembername", {
        params: { membername },
    });

    return !data.exists;
};

export const checkNicknameApi = async (
    nickname: string
): Promise<boolean> => {
    const { data } = await axiosInstance.get<{
        exists: boolean;
    }>("/api/members/checkNickname", {
        params: { nickname },
    });

    return !data.exists;
};
