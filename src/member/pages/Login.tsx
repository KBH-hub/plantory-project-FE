import "@/styles/login.css";
import { loginApi, meApi } from "@/global/services/authApi";
import { Role, useAuthStore } from "@/global/stores/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import fixmeImg from "@/assets/images/fixme.png";
import fixmeImg2 from "@/assets/images/fixme2.png";
import logo from "@/assets/images/plantory_login_logo.png"
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState("");


    const authLogin = useAuthStore((s) => s.login);
    const setUser = useAuthStore((s) => s.setUser);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await loginApi({
                membername: formData.get("membername") as string,
                password: formData.get("password") as string,
            });

            const { data } = await meApi();
            const role = data.user.role as Role;

            authLogin({
                authUser: {
                    memberId: data.user.memberId,
                    membername: data.user.membername,
                    role,
                },
                accessToken: data.accessToken,
                user: data.user,
            });

            setUser(data.user);
            setAccessToken(data.accessToken);

            navigate("/", { replace: true });
        } catch (err: any) {
            if (err.status === 401) {
                setErrorMessage("아이디 또는 비밀번호가 틀렸습니다.");
                return;
            }
            setErrorMessage(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container-fluidmin-vh-100">
                <div className="row min-vh-100">
                    <div className="col-12 col-md-6 login-panel d-flex flex-column justify-content-center px-5" style={{ backgroundColor: "#18402F" }}>
                        <img src={logo} alt="Plantory Logo" className="ph-logo-img" style={{ height: 300 }} />
                        <p className="text-white mb-4 fs-4">로그인하여 서비스를 이용해보세요</p>

                        <div className="w-75">
                            <label className="text-white fw-bold">아이디</label>
                            <input
                                type="text"
                                name="membername"
                                autoComplete="current-id"
                                className="form-control form-control-lg mb-3"
                                placeholder="아이디 입력"
                                required
                            />

                            <label className="text-white fw-bold">비밀번호</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                className="form-control form-control-lg mb-3"
                                placeholder="비밀번호 입력"
                                required
                            />

                            <div className="form-check text-white mb-3">
                                <input type="checkbox" className="form-check-input" id="keepLogin" name="remember-me" />
                                <label className="form-check-label" htmlFor="keepLogin">
                                    로그인 상태 유지
                                </label>
                            </div>

                            <div>
                                {errorMessage && (
                                    <p style={{ color: "red", marginTop: "8px" }}>
                                        {errorMessage}
                                    </p>
                                )}


                            </div>

                            <button type="submit" className="btn btn-dark w-100 py-2 fs-5 mb-3 fw-bold">
                                로그인
                            </button>

                            <p className="text-center text-white">
                                아직 회원이 아니신가요?{" "}
                                <Link to="/termsOfServicePage" className="text-warning fw-bold">
                                    회원가입 하러가기
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 bg-white d-flex flex-column justify-content-center align-items-center">
                        <h4 className="fw-bold text-center mb-4 px-4">식물 관리와 커뮤니티 참여를 통해 함께 성장해요 🌱</h4>

                        <div className="d-flex flex-wrap justify-content-center gap-4">
                            <div className="preview-img-box shadow">
                                <img src={fixmeImg} className="preview-img" alt="preview" />
                            </div>

                            <div className="preview-img-box shadow">
                                <img src={fixmeImg2} className="preview-img" alt="preview" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}