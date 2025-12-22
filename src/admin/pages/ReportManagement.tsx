import { useCallback } from "react";
import type { ReportStatusFilter } from "@/admin/types/reportManagementType";
import { useReportManagement } from "@/admin/hooks/useReportManagement";
import { ReportListTable } from "@/admin/components/ReportListTable";
import { ReportDetailModal } from "@/admin/components/modal/ReportDetailModal";
import { ReportProcessModal } from "@/admin/components/modal/ReportProcessModal";

export default function ReportManagementPage() {
  const {
    status, setStatus, keyword,
    setKeyword, items, deleteDisabled,
    loading, selected, allChecked,
    toggleAll, toggleOne, pagerRef,
    onSearch, openDetail, openProcess,
    onSubmitProcess, onDeleteSelected,
    detailOpen, setDetailOpen, processOpen,
    setProcessOpen, detail, detailImageUrl,
    adminMemo, setAdminMemo, stopDays,
    setStopDays, currentReportId,
    currentTargetMemberId, isDone,
  } = useReportManagement();

  const onEnterSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSearch();
    },
    [onSearch]
  );

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">신고관리</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 120 }}
            value={status}
            onChange={(e) => setStatus(e.target.value as ReportStatusFilter)}
          >
            <option value="">전체</option>
            <option value="false">처리 전</option>
            <option value="true">처리 완료</option>
          </select>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger btn-sm" onClick={onDeleteSelected} type="button" disabled={deleteDisabled}>
            삭제
          </button>

          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="내용으로 검색"
            style={{ width: 250 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyUp={onEnterSearch}
          />

          <button className="btn btn-secondary btn-sm" onClick={onSearch} type="button">
            <i className="bi bi-search" />
          </button>
        </div>
      </div>

      <ReportListTable
        items={items}
        loading={loading}
        selected={selected}
        allChecked={allChecked}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onOpenDetail={openDetail}
        onOpenProcess={openProcess}
        isDone={isDone}
      />

      <nav className="mt-3">
        <ul ref={pagerRef} className="pagination justify-content-center" />
      </nav>

      <ReportDetailModal open={detailOpen} onClose={() => setDetailOpen(false)} detail={detail} imageUrl={detailImageUrl} />

      <ReportProcessModal
        open={processOpen}
        onClose={() => setProcessOpen(false)}
        adminMemo={adminMemo}
        setAdminMemo={setAdminMemo}
        stopDays={stopDays}
        setStopDays={setStopDays}
        onSubmit={onSubmitProcess}
        hasTargetMember={Boolean(currentTargetMemberId)}
        disabled={!adminMemo.trim() || !currentReportId || !currentTargetMemberId}
      />
    </div>
  );
}
