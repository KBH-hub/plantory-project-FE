import {SignUpRequest} from "@/domain/member/types/memberRequest";
import {axiosInstance} from "@/global/services/api/axiosInstance";

export const signUp = (data: SignUpRequest) => {
    return axiosInstance.post("/api/members/signUp", data);
};

export const checkMembername = async (
    membername: string
): Promise<boolean> => {
    const { data } = await axiosInstance.get<{
        available: boolean;
    }>("/api/members/checkMembername", {
        params: { membername },
    });

    return data.available;
};
