import {checkMembernameApi, checkNicknameApi, signUp} from "@/member/services/memberService";
import {SignUpRequest} from "@/member/types/memberType";

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