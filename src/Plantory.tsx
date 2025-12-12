import "./css/login.css";

type Props = {
  error?: string; // /login?error=... 식으로 넘기거나 상위에서 전달
};

export default function Plantory({ error }: Props) {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          {/* LEFT side */}
          <div className="col-12 col-md-6 bg-success bg-opacity-50 login-panel">
            <h2 className="fw-bold mb-3 text-white">🌿 Plantory</h2>
            <p className="text-white mb-4 fs-4">로그인하여 서비스를 이용해보세요</p>

            <div className="w-75">
              {/* 서버로 직접 POST */}
              <form action="/login-process" method="post">
                <label className="text-white fw-bold">아이디</label>
                <input
                  type="text"
                  name="membername"
                  className="form-control form-control-lg mb-3"
                  placeholder="아이디 입력"
                  autoComplete="username"
                  required
                />

                <label className="text-white fw-bold">비밀번호</label>
                <input
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

                {error && <p className="text-danger mt-3">{error}</p>}

                <button type="submit" className="btn btn-dark w-100 py-2 fs-5 mb-3 fw-bold">
                  로그인
                </button>
              </form>

              <p className="text-center text-white">
                아직 회원이 아니신가요?{" "}
                <a href="/signUp" className="text-warning fw-bold">
                  회원가입
                </a>
              </p>
            </div>
          </div>

          {/* RIGHT side */}
          <div className="col-12 col-md-6 bg-white d-flex flex-column justify-content-center align-items-center">
            <h4 className="fw-bold text-center mb-4 px-4">
              식물 관리와 커뮤니티 참여를 통해 함께 성장해요 🌱
            </h4>

            <div className="d-flex flex-wrap justify-content-center gap-4">
              <div className="preview-img-box shadow">
                {/* public/images/fixme.png 에 두면 /images/... 로 접근 */}
                <img src="/images/fixme.png" className="preview-img" alt="preview1" />
              </div>
              <div className="preview-img-box shadow">
                <img src="/images/fixme2.png" className="preview-img" alt="preview2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}