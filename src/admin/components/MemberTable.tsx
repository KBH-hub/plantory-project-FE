import { useMemo } from "react";
import type { MemberRow } from "@/admin/types/memberManagementType";
import { formatCreatedAt, getRemainDays } from "@/admin/utils/memberFormat";
import { formatDateTime, formatDateTimePlus9, formatUTCDateTime } from "@/global/utils/formatDateTime";

type Props = {
  items: MemberRow[];
  loading: boolean;
  onRowClick: (memberId: number) => void;
};

export function MemberTable({ items, loading, onRowClick }: Props) {
  const emptyText = useMemo(() => (loading ? "불러오는 중..." : "표시할 회원이 없습니다."), [loading]);

  return (
    <div className="table-wrapper" style={{ maxHeight: 600, overflowY: "auto" }}>
      <table
        className="table table-hover bg-white rounded-3 shadow-sm text-center align-middle"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <colgroup>
          <col style={{ width: 80 }} />
          <col style={{ width: 140 }} />
          <col style={{ width: 140 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 200 }} />
          <col style={{ width: 70 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 160 }} />
        </colgroup>

        <thead className="table-secondary small">
          <tr>
            <th>일련번호</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>전화번호</th>
            <th>주소</th>
            <th>숙련지수</th>
            <th>요구관리 지수</th>
            <th>나눔 지수</th>
            <th>남은 제재 기간</th>
            <th>가입 일시</th>
          </tr>
        </thead>

        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-4 text-muted">
                {emptyText}
              </td>
            </tr>
          ) : (
            items.map((m) => (
              <tr key={m.memberId} style={{ cursor: "pointer" }} onClick={() => onRowClick(m.memberId)}>
                <td>{m.memberId ?? ""}</td>

                <td title={m.membername ?? ""}>
                  <span className="d-inline-block text-truncate w-100">{m.membername ?? ""}</span>
                </td>

                <td title={m.nickname ?? ""}>
                  <span className="d-inline-block text-truncate w-100">{m.nickname ?? ""}</span>
                </td>

                <td title={m.phone ?? ""}>
                  <span className="d-inline-block text-truncate w-100">{m.phone ?? ""}</span>
                </td>

                <td title={m.address ?? ""}>
                  <span className="d-inline-block text-truncate w-100">{m.address ?? ""}</span>
                </td>

                <td>{(m.skillRate ?? 0) + "%"}</td>
                <td>{(m.managementRate ?? 0) + "%"}</td>
                <td>{(m.sharingRate ?? 0) + "%"}</td>

                <td>{getRemainDays(m.stopDay)}</td>

                <td title={formatUTCDateTime(m.createdAt)}>
                  <span className="d-inline-block text-truncate w-100">{formatDateTimePlus9(m.createdAt)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
