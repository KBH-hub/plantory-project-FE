import { useCallback } from "react";
import type { ReportStatusFilter } from "@/admin/types/reportManagementType";
import { useReportManagement } from "@/admin/hooks/useReportManagement";
import { ReportListTable } from "@/admin/components/ReportListTable";
import { ReportDetailModal } from "@/admin/components/modal/ReportDetailModal";
import { ReportProcessModal } from "@/admin/components/modal/ReportProcessModal";

export default function ReportManagementPage() {
  const { filter, table, pager, modal, actions } = useReportManagement();

  const onEnterSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") filter.onSearch();
    },
    [filter]
  );

  const processDisabled =
    !modal.adminMemo.trim() ||
    !modal.currentReportId ||
    !modal.currentTargetMemberId;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">신고관리</h3>

      <div className="d-flex justify-content-between align-items-center py-3">
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 120 }}
            value={filter.status}
            onChange={(e) => filter.setStatus(e.target.value as ReportStatusFilter)}
          >
            <option value="">전체</option>
            <option value="false">처리 전</option>
            <option value="true">처리 완료</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={actions.onDeleteSelected}
            type="button"
            disabled={table.deleteDisabled}
          >
            삭제
          </button>

          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="내용으로 검색"
            style={{ width: 250 }}
            value={filter.keyword}
            onChange={(e) => filter.setKeyword(e.target.value)}
            onKeyUp={onEnterSearch}
          />

          <button className="btn btn-secondary btn-sm" onClick={filter.onSearch} type="button">
            <i className="bi bi-search" />
          </button>
        </div>
      </div>

      <ReportListTable
        items={table.items}
        loading={table.loading}
        selected={table.selected}
        allChecked={table.allChecked}
        onToggleAll={table.toggleAll}
        onToggleOne={table.toggleOne}
        onOpenDetail={table.openDetail}
        onOpenProcess={table.openProcess}
        isDone={table.isDone}
      />

      <nav className="mt-3">
        <ul ref={pager.pagerRef} className="pagination justify-content-center" />
      </nav>

      <ReportDetailModal
        open={modal.detailOpen}
        onClose={() => modal.setDetailOpen(false)}
        detail={modal.detail}
        imageUrl={modal.detailImageUrl}
      />

      <ReportProcessModal
        open={modal.processOpen}
        onClose={() => modal.setProcessOpen(false)}
        adminMemo={modal.adminMemo}
        setAdminMemo={modal.setAdminMemo}
        stopDays={modal.stopDays}
        setStopDays={modal.setStopDays}
        onSubmit={actions.onSubmitProcess}
        hasTargetMember={Boolean(modal.currentTargetMemberId)}
        disabled={processDisabled}
      />
    </div>
  );
}

