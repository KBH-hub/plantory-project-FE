import { Link } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";

import NoticeDropdown from "@/notice/components/NoticeDropdown";
import ReportModal from "@/report/components/ReportModal";
import MemberSearchModal from "@/report/components/MemberSearchModal";

import { useNotice } from "@/notice/hooks/useNotice";
import { useReportFlow } from "@/report/hooks/useReport";
import useLogout from "@/global/hooks/useLogout";
import UserDropdown from "../../global/components/UserDropdown";
export default function UserHeader() {
  const user = useAuthStore((s) => s.user);
  const handleLogout = useLogout();
  const { alarms, alarmCount, moveNotice, clearAllNotice } = useNotice();

  const {
    reportTarget,
    reportContent,
    setReportContent,
    reportPreview,
    fileInputRef,
    setReportFiles,
    openReportModal,
    openMemberSearchModal,

    keyword,
    setKeyword,
    results,
    loadingSearch,
    searchMember,
    chooseMember,
    closeMemberSearchModal,

    submitReport,
  } = useReportFlow();

  return (
    <>
      <nav
        className="bg-white px-4 shadow-sm d-flex align-items-center sticky-top"
        style={{ height: 80, minWidth: 1470 }}
        aria-label="주요 탐색"
      >
        <div className="d-flex align-items-center justify-content-between w-100" style={{ minWidth: 1450 }}>
          <Link to="/dashboard" className="ph-logo" aria-label="대시보드로 이동">
            <img src="/images/plantory_logo.png" alt="Plantory Logo" className="ph-logo-img" />
          </Link>

          <ul className="navbar-nav d-flex flex-row gap-4 mx-3 flex-grow-1 justify-content-center ph-menu">
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
                <li>
                  <Link to="/sharingList" className="dropdown-item ph-dropdown-item">
                    나눔 게시판
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item ph-dropdown-item" to="/questionList">
                    질문 게시판
                  </Link>
                </li>
              </ul>
            </li>

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
                <li>
                  <Link className="dropdown-item ph-dropdown-item" to="/plantDictionary">
                    실내 식물
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item ph-dropdown-item" to="/dryPlantDictionary">
                    건조 식물
                  </Link>
                </li>
              </ul>
            </li>

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
                <li>
                  <Link className="dropdown-item ph-dropdown-item" to="/plantCalendar">
                    식물 캘린더
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item ph-dropdown-item" to="/myPlantManagement">
                    내 식물 관리
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-4 ms-4 ph-right">
            <NoticeDropdown
              alarms={alarms}
              alarmCount={alarmCount}
              onItemClick={moveNotice}
              onClearAll={clearAllNotice}
            />

            <Link to="/messageList" className="text-dark text-decoration-none" aria-label="쪽지함으로 이동">
              <i className="bi bi-envelope fs-4 ph-mail" />
            </Link>

            <button type="button" className="btn p-0" onClick={openReportModal} aria-label="신고 모달 열기">
              <i className="bi bi-exclamation-triangle fs-4 ph-report" />
            </button>

              <UserDropdown />
          </div>
        </div>
      </nav>

      <ReportModal
        reportTargetNickname={reportTarget.nickname}
        reportTargetId={String(reportTarget.id || "")}
        reportContent={reportContent}
        reportPreview={reportPreview}
        fileInputRef={fileInputRef}
        onOpenMemberSearch={openMemberSearchModal}
        onChangeContent={setReportContent}
        onPickFiles={setReportFiles}
        onSubmit={submitReport}
      />

      <MemberSearchModal
        keyword={keyword}
        loading={loadingSearch}
        results={results}
        onChangeKeyword={setKeyword}
        onSearch={searchMember}
        onChoose={chooseMember}
        onClose={closeMemberSearchModal}
      />
    </>
  );
}