import { useEffect, useRef, useState } from "react";
import axios from "axios";

type MemberLite = { memberId: number | string; nickname: string } | null;

type AlarmItem = {
  id: number | string;
  at: string;
  text: string;
  href?: string;
};

type SearchResult = { id: number | string; nickname: string };

export default function Header({ me }: { me: MemberLite }) {
  const [alarms, setAlarms] = useState<AlarmItem[]>([
    { id: 1, at: "2025-10-27 10:42", text: "방토방토님의 나눔이 완료되었습니다...", href: "#" },
  ]);
  const alarmCount = alarms.length;

  const [reportTarget, setReportTarget] = useState<{ id: string | number | null; nickname: string }>({
    id: null,
    nickname: "",
  });
  const [reportContent, setReportContent] = useState("");
  const [reportImage, setReportImage] = useState<File | null>(null);
  const [reportPreview, setReportPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // 이미지 미리보기 URL 관리
  useEffect(() => {
    if (!reportImage) {
      setReportPreview("");
      return;
    }
    const url = URL.createObjectURL(reportImage);
    setReportPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [reportImage]);

  const openMemberSearchModal = () => {
    setKeyword("");
    setResults([]);
  };
  const closeMemberSearchModal = () => {
    setKeyword("");
    setResults([]);
  };

  const searchMember = async () => {
    if (!keyword.trim()) return;
    try {
      setLoadingSearch(true);
      // TODO: 실제 API로 교체
      setTimeout(() => {
        setResults(
          ["sunny", "leafy", "monstera", "aloe"]
            .filter((n) => n.includes(keyword))
            .map((n, i) => ({ id: i + 1, nickname: n }))
        );
        setLoadingSearch(false);
      }, 400);
    } catch (e) {
      setLoadingSearch(false);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  const chooseMember = (m: SearchResult) => {
    setReportTarget({ id: m.id, nickname: m.nickname });
  };

  const submitReport = async () => {
    if (!reportTarget.id) return alert("피신고자를 선택해 주세요.");
    if (!reportContent.trim()) return alert("신고 내용을 입력해 주세요.");
    if (!reportImage) return alert("근거 사진을 업로드해 주세요.");

    try {
      const form = new FormData();
      form.append("targetMemberId", String(reportTarget.id));
      form.append("content", reportContent);
      form.append("image", reportImage);
      await axios.post("/api/report", form, { headers: { "Content-Type": "multipart/form-data" } });

      alert("신고가 접수되었습니다.");
      setReportTarget({ id: null, nickname: "" });
      setReportContent("");
      setReportImage(null);
      setReportPreview("");
    } catch (e: any) {
      const msg = e?.response?.data?.message || "신고 처리 중 오류가 발생했습니다.";
      alert(msg);
    }
  };

  const clearAllAlarms = () => setAlarms([]);

  return (
    <>
      <nav
        className="bg-white px-4 shadow-sm d-flex align-items-center sticky-top"
        style={{ height: 80, minWidth: 1470 }}
        aria-label="주요 탐색"
      >
        <div className="d-flex align-items-center justify-content-between w-100" style={{ minWidth: 1450 }}>
          {/* 로고 */}
          <a href="/dashboard" className="ph-logo" aria-label="대시보드로 이동">
            <img src="/image/plantory_logo.png" alt="Plantory Logo" className="ph-logo-img" />
          </a>

          {/* 중앙 메뉴 */}
          <ul className="navbar-nav d-flex flex-row gap-4 mx-3 flex-grow-1 justify-content-center ph-menu">
            {/* 커뮤니티 */}
            <li className="nav-item dropdown ph-menu-item">
              <button
                type="button"
                className="nav-link fw-bold fs-5 ph-menu-text btn btn-link p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                커뮤니티
              </button>
              <ul className="dropdown-menu ph-dropdown">
                <li><a className="dropdown-item ph-dropdown-item" href="/sharingList">나눔 게시판</a></li>
                <li><a className="dropdown-item ph-dropdown-item" href="/questionList">질문 게시판</a></li>
              </ul>
            </li>

            {/* 식물사전 */}
            <li className="nav-item dropdown ph-menu-item">
              <button
                type="button"
                className="nav-link fw-bold fs-5 ph-menu-text btn btn-link p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                식물사전
              </button>
              <ul className="dropdown-menu ph-dropdown">
                <li><a className="dropdown-item ph-dropdown-item" href="/plantDictionary">실내 식물</a></li>
                <li><a className="dropdown-item ph-dropdown-item" href="/dryPlantDictionary">건조 식물</a></li>
              </ul>
            </li>

            {/* 나의 식물 */}
            <li className="nav-item dropdown ph-menu-item">
              <button
                type="button"
                className="nav-link fw-bold fs-5 ph-menu-text btn btn-link p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                나의 식물
              </button>
              <ul className="dropdown-menu ph-dropdown">
                <li><a className="dropdown-item ph-dropdown-item" href="/plantCalendar">식물 캘린더</a></li>
                <li><a className="dropdown-item ph-dropdown-item" href="/myPlantManagement">내 식물 관리</a></li>
              </ul>
            </li>
          </ul>

          {/* 오른쪽 아이콘 */}
          <div className="d-flex align-items-center gap-4 ms-4 ph-right">
            {/* 알림 */}
            <div className="dropdown ph-alarm position-relative">
              <button
                type="button"
                className="btn p-0"
                id="alarmDropdownBtn"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="알림 열기"
              >
                <i className="bi bi-bell fs-4 ph-alarm-icon" />
              </button>
              <span
                id="alarmBadge"
                className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${
                  alarmCount ? "" : "d-none"
                }`}
                style={{ fontSize: ".65rem", minWidth: "1.25rem" }}
                aria-label={`알림 ${alarmCount}개`}
              >
                {alarmCount}
              </span>

              <div className="dropdown-menu dropdown-menu-end p-0 border-0 shadow ph-alarm-box" aria-labelledby="alarmDropdownBtn">
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center ph-alarm-header">
                  <h5 className="fw-bold mb-0">알림</h5>
                </div>

                <div id="alarmList" className="ph-alarm-list">
                  {alarms.length === 0 && (
                    <div className="p-3 text-center text-secondary small">새 알림이 없습니다.</div>
                  )}
                  {alarms.map((a) => (
                    <div key={a.id} className="p-3 border-bottom d-flex align-items-start ph-alarm-item">
                      <input type="checkbox" className="form-check-input me-2 alarm-check d-none" />
                      <div className="w-100">
                        <small className="text-secondary d-block">{a.at}</small>
                        <a href={a.href || "#"} className="fw-semibold text-dark d-block text-truncate">
                          {a.text}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-center p-2 ph-alarm-footer">
                  <button id="removeAllAlarm" className="btn btn-danger btn-sm" type="button" onClick={clearAllAlarms}>
                    비우기
                  </button>
                </div>
              </div>
            </div>

            {/* 쪽지 */}
            <a href="/messageList" className="text-dark text-decoration-none" aria-label="쪽지함으로 이동">
              <i className="bi bi-envelope fs-4 ph-mail" />
            </a>

            {/* 신고 */}
            <button
              type="button"
              className="btn p-0"
              data-bs-toggle="modal"
              data-bs-target="#reportModal"
              aria-label="신고 모달 열기"
            >
              <i className="bi bi-exclamation-triangle fs-4 ph-report" />
            </button>

            {/* 프로필 */}
            <div className="dropdown ph-profile">
              <button
                type="button"
                className="d-flex align-items-center text-dark text-decoration-none ph-profile-btn btn btn-link p-0"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="프로필 메뉴 열기"
              >
                <i className="bi bi-person-circle fs-3" />
                <span className="ms-2">{me?.nickname || "Guest"}</span>님
              </button>
              <ul className="dropdown-menu dropdown-menu-end ph-profile-menu">
                <li><a className="dropdown-item" href="/profile">내 프로필</a></li>
                <li><a className="dropdown-item text-danger" href="/logout">로그아웃</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* 신고하기 모달 */}
      <div className="modal fade" id="reportModal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">신고하기</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <label className="fw-bold">피신고자 아이디 *</label>
              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  placeholder="회원검색을 통해 선택하세요"
                  value={reportTarget.nickname}
                />
                <button
                  type="button"
                  className="btn btn-dark"
                  data-bs-toggle="modal"
                  data-bs-target="#memberSearchModal"
                  onClick={openMemberSearchModal}
                  style={{ minWidth: 90 }}
                >
                  회원검색
                </button>
              </div>

              <input type="hidden" name="targetMemberId" value={String(reportTarget.id || "")} />

              <label className="fw-bold">내용 *</label>
              <textarea
                className="form-control mb-3"
                rows={4}
                placeholder="신고 내용을 입력하세요."
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
              />

              <label className="fw-bold d-block">근거사진 *</label>
              <div
                className="border rounded d-flex justify-content-center align-items-center"
                style={{ width: 120, height: 120, cursor: "pointer" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {!reportPreview && <i className="bi bi-camera fs-2 text-secondary" />}
                {reportPreview && (
                  <img
                    style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                    src={reportPreview}
                    alt="report"
                  />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={(e) => setReportImage(e.target.files?.[0] || null)}
              />
              <p className="text-danger small mt-2">* 허위신고 시 불이익이 있을 수 있습니다.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">
                취소
              </button>
              <button className="btn btn-success" type="button" onClick={submitReport} data-bs-dismiss="modal">
                신고하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 회원 검색 모달 */}
      <div className="modal fade" id="memberSearchModal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">회원 검색</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={closeMemberSearchModal}
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="fw-bold">피신고자 아이디 *</label>
                <div className="d-flex gap-2">
                  <input
                    className="form-control"
                    placeholder="닉네임 입력"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchMember()}
                  />
                  <button
                    className="btn btn-dark"
                    style={{ minWidth: 70 }}
                    onClick={searchMember}
                    disabled={loadingSearch}
                    type="button"
                  >
                    {loadingSearch ? "검색중..." : "검색"}
                  </button>
                </div>
              </div>

              <div className="table-responsive mt-4">
                <table className="table align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th>닉네임</th>
                      <th>회원 선택</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-secondary">
                          결과가 없습니다.
                        </td>
                      </tr>
                    )}
                    {results.map((m) => (
                      <tr key={m.id}>
                        <td>{m.nickname}</td>
                        <td>
                          <button
                            className="btn btn-outline-dark btn-sm"
                            data-bs-dismiss="modal"
                            onClick={() => chooseMember(m)}
                            type="button"
                          >
                            선택
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary w-25"
                data-bs-dismiss="modal"
                onClick={closeMemberSearchModal}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
