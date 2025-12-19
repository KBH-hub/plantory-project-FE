import {checkMembernameApi, checkNicknameApi, signUp} from "@/member/services/memberApi";
import {SignUpRequest} from "@/member/types/memberRequest";

export function useSignUp() {
    const checkMembername = (membername: string) => {
        return checkMembernameApi(membername);
    };

    const checkNickname = (nickname: string) => {
        return checkNicknameApi(nickname);
    };

    const submit = async (data: SignUpRequest) => {
        await signUp(data);
    };

    return { checkMembername, checkNickname, submit };
}