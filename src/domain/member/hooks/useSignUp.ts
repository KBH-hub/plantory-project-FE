import {checkMembername, signUp} from "@/domain/member/services/memberApi";
import {SignUpRequest} from "@/domain/member/types/memberRequest";

export function useSignUp() {
    const checkId = (membername: string) => {
        return checkMembername(membername);
    };

    const submit = async (data: SignUpRequest) => {
        await signUp(data);
    };

    return { checkId, submit };
}