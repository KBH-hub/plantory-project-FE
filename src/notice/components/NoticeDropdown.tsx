import { formatDateTime } from "@/global/utils/formatDateTime";
import type { notice } from "@/notice/types/notice";

type Props = {
  alarms: notice[];
  alarmCount: number;
  onItemClick: (noticeId: number, href: string) => void;
  onClearAll: () => void;
};

export default function NoticeDropdown({ alarms, alarmCount, onItemClick, onClearAll }: Props) {
  const hasAlarms = alarms.length > 0;

  return (
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

      <div
        className="dropdown-menu dropdown-menu-end p-0 border-0 shadow ph-alarm-box"
        aria-labelledby="alarmDropdownBtn"
      >
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center ph-alarm-header">
          <h5 className="fw-bold mb-0">알림</h5>
        </div>

        <div id="alarmList" className="ph-alarm-list">
          {!hasAlarms && <div className="p-3 text-center text-secondary small">새 알림이 없습니다.</div>}

          {alarms.map((a) => (
            <div
              key={a.noticeId}
              role="button"
              tabIndex={0}
              className="p-3 border-bottom d-flex align-items-start ph-alarm-item"
              onClick={() => onItemClick(a.noticeId, (a as any).href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onItemClick(a.noticeId, (a as any).href);
              }}
            >
              <div className="w-100">
                <small className="text-secondary d-block">{formatDateTime(a.createdAt)}</small>
                <div className="fw-semibold text-dark d-block text-truncate">{a.content}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center p-2 ph-alarm-footer">
          <button
            id="removeAllAlarm"
            className="btn btn-danger btn-sm"
            type="button"
            disabled={!hasAlarms}
            aria-disabled={!hasAlarms}
            title={!hasAlarms ? "삭제할 알림이 없습니다." : undefined}
            onClick={() => {
              if (!hasAlarms) return;
              onClearAll();
            }}
          >
            비우기
          </button>
        </div>
      </div>
    </div>
  );
}
