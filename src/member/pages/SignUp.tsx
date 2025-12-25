import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showModal } from "@/global/utils/showModal";
import { useSubmitWithAlert } from "@/global/hooks/useSubmitWithAlert";
import { useSignUp } from "@/member/hooks/useSignUp";
import { useDuplicateCheck } from "@/member/hooks/useDuplicateCheck";
import type { SignUpRequest } from "@/member/types/memberType";
import MemberForm, { ID_REGEX, PASSWORD_REGEX } from "@/member/components/MemberForm";
import { MemberFormValues } from "@/member/types/memberType";

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
        pwCheck: "",
    });

    const idCheck = useDuplicateCheck({
        checkFn: checkMembername,
        emptyMessage: "아이디를 입력해주세요.",
        successMessage: "사용 가능한 아이디입니다.",
        failMessage: "이미 사용 중인 아이디입니다.",
    });

    const nicknameCheck = useDuplicateCheck({
        checkFn: checkNickname,
        emptyMessage: "닉네임을 입력해주세요.",
        successMessage: "사용 가능한 닉네임입니다.",
        failMessage: "이미 사용 중인 닉네임입니다.",
    });

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

        // 아이디 형식
        if (!ID_REGEX.test(membername)) {
            await showModal.alert("아이디 형식을 확인해주세요. (5~20자, 영문/숫자, . _ - 중간만 허용)");
            return;
        }

        // 전화번호 형식(필수로 받는다고 가정)
        if (!/^010-\d{3,4}-\d{4}$/.test(phone)) {
            await showModal.alert("휴대전화 형식을 확인해주세요. (예: 010-1234-5678)");
            return;
        }

        // 비밀번호 규칙
        if (!PASSWORD_REGEX.test(password)) {
            await showModal.alert("비밀번호는 최소 8자이며 영문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.");
            return;
        }

        // 비밀번호 확인
        if (values.password !== values.pwCheck) {
            await showModal.alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!idCheck.isValidFor?.(membername)) {
            await showModal.alert("아이디 중복 확인을 해주세요.");
            return;
        }
        if (!nicknameCheck.isValidFor?.(nickname)) {
            await showModal.alert("닉네임 중복 확인을 해주세요.");
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