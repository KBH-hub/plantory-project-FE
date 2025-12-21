import { useState } from "react";
import AddressSelect from "@/global/components/AddressSelect";
import { useSignUp } from "@/member/hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import { showModal } from "@/global/utils/showModal";
import { useSubmitWithAlert } from "@/global/hooks/useSubmitWithAlert";
import type { SignUpRequestType } from "@/member/types/memberRequestType";
import { useDuplicateCheck } from "@/member/hooks/useDuplicateCheck";

const SignUpPage = () => {
    const navigate = useNavigate();
    const { submitWithAlert } = useSubmitWithAlert<SignUpRequestType>();

    const { checkMembername, checkNickname, submit } = useSignUp();

    const [membername, setMembername] = useState("");
    const [nickname, setNickname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [pwCheck, setPwCheck] = useState("");
    const [address, setAddress] = useState("");

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!idCheck.isValidFor(membername)) {
            await showModal.alert("아이디 중복 확인을 해주세요.");
            return;
        }

        if (!nicknameCheck.isValidFor(nickname)) {
            await showModal.alert("닉네임 중복 확인을 해주세요.");
            return;
        }

        if (password !== pwCheck) {
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
            { membername, nickname, phone, password, address }
        );
    };

    return (
      <div className="bg-dark min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="mx-auto p-5 bg-white rounded shadow" style={{ maxWidth: 700 }}>
            <h4 className="fw-bold mb-4">회원가입</h4>

            <form onSubmit={handleSubmit}>
              <label className="fw-bold">아이디 *</label>
              <div className="input-group">
                <input
                    className="form-control"
                    value={membername}
                    onChange={(e) => {
                      setMembername(e.target.value);
                      idCheck.reset();
                    }}
                />
                  <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => idCheck.check(membername)}
                  disabled={idCheck.isChecking}
              >
                  중복 확인
              </button>
              </div>
                {idCheck.message && (
                    <p className={`small ${idCheck.isAvailable ? "text-success" : "text-danger"}`}>
                        {idCheck.message}
                    </p>
              )}

                <label className="fw-bold mt-3">닉네임 *</label>
                <div className="input-group">
                    <input
                        className="form-control"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            nicknameCheck.reset();
                        }}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => nicknameCheck.check(nickname)}
                        disabled={nicknameCheck.isChecking}
                    >
                        중복 확인
                    </button>
                </div>

                {nicknameCheck.message && (
                    <p className={`small ${nicknameCheck.isAvailable ? "text-success" : "text-danger"}`}>
                        {nicknameCheck.message}
                    </p>
                )}

              <AddressSelect onChange={setAddress} />

              <input
                  className="form-control mt-3"
                  placeholder="휴대전화"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
              />

              <input
                  type="password"
                  className="form-control mt-3"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />

              <input
                  type="password"
                  className="form-control mt-3"
                  placeholder="비밀번호 확인"
                  value={pwCheck}
                  onChange={(e) => setPwCheck(e.target.value)}
              />

              <button className="btn btn-success w-100 mt-4">가입하기</button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default SignUpPage;
