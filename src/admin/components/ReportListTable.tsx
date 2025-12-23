import { useMemo } from "react";
import type { ReportListItem } from "@/admin/types/reportManagementType";
import { formatDateTime } from "@/global/utils/formatDateTime";

export function ReportListTable({
  items,
  loading,
  selected,
  allChecked,
  onToggleAll,
  onToggleOne,
  onOpenDetail,
  onOpenProcess,
  isDone,
}: {
  items: ReportListItem[];
  loading: boolean;
  selected: Set<number>;
  allChecked: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: number) => void;
  onOpenDetail: (reportId: number) => void;
  onOpenProcess: (reportId: number, targetMemberId?: string | null) => void;
  isDone: (status: ReportListItem["status"]) => boolean;
}) {
  const emptyText = useMemo(() => (loading ? "로딩 중..." : "조회된 신고가 없습니다."), [loading]);

  return (
    <div className="table-wrapper" style={{ maxHeight: 600, overflowY: "auto" }}>
      <table className="table table-hover bg-white rounded-3 shadow-sm text-center align-middle" style={{ tableLayout: "fixed", width: "100%" }}>
        <colgroup>
          <col style={{ width: 44 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 90 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 230 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 120 }} />
        </colgroup>

        <thead className="table-secondary">
          <tr>
            <th>
              <input type="checkbox" checked={allChecked} onChange={onToggleAll} />
            </th>
            <th>피신고자 아이디</th>
            <th>신고자 아이디</th>
            <th>처리 관리자 아이디</th>
            <th>신고 내용</th>
            <th>처리 상태</th>
            <th>신고처리</th>
            <th>신고 시간</th>
          </tr>
        </thead>

        <tbody style={{ tableLayout: "auto", width: "auto", whiteSpace: "nowrap" }}>
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4 text-muted">
                {emptyText}
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const done = isDone(item.status);

              return (
                <tr key={item.reportId}>
                  <td>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selected.has(item.reportId)}
                      onChange={() => onToggleOne(item.reportId)}
                    />
                  </td>

                  <td>{item.targetMemberId ?? "-"}</td>
                  <td>{item.reporterId ?? "-"}</td>
                  <td>{item.adminId ?? "-"}</td>

                  <td
                    className="text-truncate"
                    style={{ maxWidth: 200, cursor: "pointer" }}
                    onClick={() => onOpenDetail(item.reportId)}
                    title={item.content}
                  >
                    {item.content}
                  </td>

                  <td>
                    {done ? <span className="badge bg-success">처리완료</span> : <span className="badge bg-secondary">처리전</span>}
                  </td>

                  <td>
                    <button
                      className={`btn btn-sm ${done ? "btn-secondary" : "btn-danger"}`}
                      onClick={() => onOpenProcess(item.reportId, item.targetMemberId ?? null)}
                      type="button"
                    >
                      신고처리
                    </button>
                  </td>

                  <td>{formatDateTime(item.createdAt ?? "")}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
