import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function TermsOfServicePage() {
    const navigate = useNavigate();

    const [agree1, setAgree1] = useState(false);
    const [agree2, setAgree2] = useState(false);
    const [agree3, setAgree3] = useState(false);

    const isAllRequiredAgreed = agree1 && agree2;

    const handleSubmit = () => {
        if (!isAllRequiredAgreed) return;
        navigate("/signup");
    };

    return (
        <div className="bg-dark min-vh-100 d-flex align-items-center">
            <div className="container py-5">
                <div
                    className="mx-auto bg-white p-4 rounded"
                    style={{ maxWidth: "600px" }}
                >
                    <h2 className="text-center fw-bold mb-3">Plantory</h2>
                    <p className="text-center mb-4">
                        식물을 관리하고 커뮤니티를 사용하려면 가입하세요.
                    </p>

                    <h6 className="fw-bold">이용약관 동의</h6>
                    <div className="border p-3 mb-2" style={{ height: 150, overflowY: "auto" }}>
                        <p className="small mb-0">
                            제1조 (목적)
                            <br />
                            본 약관은 Plantory 서비스 이용과 관련하여 회사와 회원 간의
                            권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
                        </p>
                    </div>

                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={agree1}
                            onChange={(e) => setAgree1(e.target.checked)}
                            id="agree1"
                        />
                        <label className="form-check-label" htmlFor="agree1">
                            이용약관에 동의합니다.
                        </label>
                    </div>
                    {!agree1 && (
                        <p className="text-danger small">※ 동의가 필요한 항목입니다.</p>
                    )}

                    <h6 className="fw-bold mt-4">개인정보 수집 및 이용 안내</h6>
                    <div className="border p-3 mb-2" style={{ height: 150, overflowY: "auto" }}>
                        <p className="small mb-0">
                            수집 항목: 이름, 이메일, 비밀번호
                            <br />
                            이용 목적: 회원 식별, 서비스 제공, 고객 문의 대응
                            <br />
                            보유 기간: 회원 탈퇴 시 즉시 파기
                        </p>
                    </div>

                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={agree2}
                            onChange={(e) => setAgree2(e.target.checked)}
                            id="agree2"
                        />
                        <label className="form-check-label" htmlFor="agree2">
                            개인정보 수집 및 이용에 동의합니다.
                        </label>
                    </div>
                    {!agree2 && (
                        <p className="text-danger small">※ 동의가 필요한 항목입니다.</p>
                    )}

                    <div className="form-check my-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={agree3}
                            onChange={(e) => setAgree3(e.target.checked)}
                            id="agree3"
                        />
                        <label className="form-check-label" htmlFor="agree3">
                            SMS 알림 수신에 동의합니다.
                        </label>
                    </div>

                    <button
                        className="btn btn-primary w-100 mb-3"
                        disabled={!isAllRequiredAgreed}
                        onClick={handleSubmit}
                    >
                        동의하고 진행
                    </button>

                    <p className="text-center">
                        이미 계정이 있으신가요?{" "}
                        <Link to="/login" className="text-danger fw-bold">
                            로그인
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
