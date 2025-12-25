import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showModal } from "@/global/utils/showModal";
import { useSubmitWithAlert } from "@/global/hooks/useSubmitWithAlert";
import { useSignUp } from "@/member/hooks/useSignUp";
import { useDuplicateCheck } from "@/member/hooks/useDuplicateCheck";
import type { SignUpRequest } from "@/member/types/memberType";
import MemberForm from "@/member/components/MemberForm";
import {MemberFormValues} from "@/member/types/memberType";

const SignUp = () => {
    const navigate = useNavigate();
    const { submitWithAlert } = useSubmitWithAlert<SignUpRequest>();
    const { checkMembername, checkNickname, submit } = useSignUp();

    const [values, setValues] = useState<MemberFormValues>({
        noticeEnabled: false,
        membername: "",
        nickname: "",
        phone: "",
        address: "",
        password: "",
        pwCheck: ""
    });

    const idCheck = useDuplicateCheck({ checkFn: checkMembername, emptyMessage: "아이디를 입력해주세요.", successMessage: "사용 가능한 아이디입니다.", failMessage: "이미 사용 중인 아이디입니다." });
    const nicknameCheck = useDuplicateCheck({ checkFn: checkNickname, emptyMessage: "닉네임을 입력해주세요.", successMessage: "사용 가능한 닉네임입니다.", failMessage: "이미 사용 중인 닉네임입니다." });

    const onChange = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        if (key === "membername") idCheck.reset();
        if (key === "nickname") nicknameCheck.reset();
    };

    const handleSubmit = async () => {
        const membername = values.membername.trim();
        const nickname = values.nickname.trim();
        const phone = values.phone.trim();
        const password = values.password;

        if (!idCheck.isValidFor(values.membername)) {
            await showModal.alert("아이디 중복 확인을 해주세요.");
            return;
        }
        if (!nicknameCheck.isValidFor(values.nickname)) {
            await showModal.alert("닉네임 중복 확인을 해주세요.");
            return;
        }
        if (values.password !== values.pwCheck) {
            await showModal.alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        await submitWithAlert(
            {
                submit,
                successMessage: "회원가입 성공",
                failureMessage: "회원가입 실패",
                onSuccess: () => navigate("/login"),
            },
            {
                membername,
                nickname,
                phone,
                password,
                address: values.address,
            }
        );
    };

    return (
        <div className="bg-dark min-vh-100 d-flex align-items-center">
            <div className="container">
                <div className="mx-auto p-5 bg-white rounded shadow" style={{ maxWidth: 700 }}>
                    <h4 className="fw-bold mb-4">회원가입</h4>

                    <MemberForm
                        mode="signup"
                        values={values}
                        onChange={onChange}
                        idCheck={idCheck}
                        nicknameCheck={nicknameCheck}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default SignUp;
