import { useState } from "react";
import AddressSelect from "@/global/components/AddressSelect";
import { useSignUp } from "@/member/hooks/useSignUp";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { checkMembername, checkNickname, submit } = useSignUp();
  const [membername, setMembername] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [address, setAddress] = useState("");

  const [isMembernameAvailable, setIsMembernameAvailable] =
      useState<boolean | null>(null);
  const [isNicknameAvailable, setIsNicknameAvailable] =
      useState<boolean | null>(null);

  const [idMessage, setIdMessage] = useState("");
  const [nicknameMessage, setNicknameMessage] = useState("");

  const handleCheckMembername = async () => {
    if (!membername) {
      setIsMembernameAvailable(false);
      setIdMessage("아이디를 입력해주세요.");
      return;
    }

    try {
      const available = await checkMembername(membername);
      setIsMembernameAvailable(available);
      setIdMessage(
          available
              ? "사용 가능한 아이디입니다."
              : "이미 사용 중인 아이디입니다."
      );
    } catch {
      setIsMembernameAvailable(false);
      setIdMessage("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  const handleCheckNickname = async () => {
    if (!nickname) {
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임을 입력해주세요.");
      return;
    }

    try {
      const available = await checkNickname(nickname);
      setIsNicknameAvailable(available);
      setNicknameMessage(
          available
              ? "사용 가능한 닉네임입니다."
              : "이미 사용 중인 닉네임입니다."
      );
    } catch {
      setIsNicknameAvailable(false);
      setNicknameMessage("닉네임 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isMembernameAvailable !== true) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (isNicknameAvailable !== true) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }

    if (password !== pwCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await submit({
        membername,
        nickname,
        phone,
        password,
        address,
      });

      alert("회원가입 성공");
      navigate("/login");
    } catch {
      alert("회원가입 실패");
    }
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
                      setIsMembernameAvailable(null);
                      setIdMessage("");
                    }}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={handleCheckMembername}>
                  중복 확인
                </button>
              </div>
              {idMessage && (
                  <p className={`small ${isMembernameAvailable ? "text-success" : "text-danger"}`}>
                    {idMessage}
                  </p>
              )}

              <label className="fw-bold mt-3">닉네임 *</label>
              <div className="input-group">
                <input
                    className="form-control"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setIsNicknameAvailable(null);
                      setNicknameMessage("");
                    }}
                />
                <button type="button" className="btn btn-outline-secondary" onClick={handleCheckNickname}>
                  중복 확인
                </button>
              </div>
              {nicknameMessage && (
                  <p className={`small ${isNicknameAvailable ? "text-success" : "text-danger"}`}>
                    {nicknameMessage}
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
