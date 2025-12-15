import "../styles/login.css";
import { login as loginApi } from "../api/auth";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const authLogin = useAuthStore((s) => s.login);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    try {
      const res = await loginApi({
        membername: fd.get("membername") as string,
        password: fd.get("password") as string,
        // ✅ remember-me → rememberMe로 매핑
        rememberMe: fd.get("remember-me") === "on",
      });

      authLogin({
        user: {
          memberId: res.data.memberId,
          membername: res.data.membername,
          role: res.data.role,
        },
        accessToken: res.data.accessToken,
      });

      // ✅ PrivateRoute가 남긴 원래 목적지로 복귀 (없으면 /dashboard)
      const dest = (location.state as any)?.from?.pathname ?? "/dashboard";
      navigate(dest, { replace: true });

    } catch (err) {
      console.error(err);
      // TODO: 사용자 피드백 alert/toast 연결
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-fluid bg-dark min-vh-100">
        <div className="row min-vh-100">

          {/* LEFT */}
          <div className="col-12 col-md-6 bg-success bg-opacity-50 login-panel d-flex flex-column justify-content-center align-items-start px-5">
            <h2 className="fw-bold mb-3 text-white">🌿 Plantory</h2>
            <p className="text-white mb-4 fs-4">로그인하여 서비스를 이용해보세요</p>

            <div className="w-75">
              <label className="text-white fw-bold" htmlFor="membername">아이디</label>
              <input
                id="membername"
                type="text"
                name="membername"
                className="form-control form-control-lg mb-3"
                placeholder="아이디 입력"
                autoComplete="username"
                required
              />

              <label className="text-white fw-bold" htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-control form-control-lg mb-3"
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                required
              />

              <div className="form-check text-white mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="keepLogin"
                  name="remember-me"
                />
                <label className="form-check-label" htmlFor="keepLogin">
                  로그인 상태 유지
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-dark w-100 py-2 fs-5 mb-3 fw-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </button>

              <p className="text-center text-white">
                아직 회원이 아니신가요?{" "}
                <a href="/signup" className="text-warning fw-bold">회원가입</a>
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-12 col-md-6 bg-white d-flex flex-column justify-content-center align-items-center">
            <h4 className="fw-bold text-center mb-4 px-4">
              식물 관리와 커뮤니티 참여를 통해 함께 성장해요 🌱
            </h4>

            <div className="d-flex flex-wrap justify-content-center gap-4">
              <div className="preview-img-box shadow">
                {/* ✅ 빌드 안전한 경로로 교체 */}
                <img src="/images/fixme.png" className="preview-img" alt="preview" />
              </div>
              <div className="preview-img-box shadow">
                <img src="/images/fixme.png" className="preview-img" alt="preview" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
