import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReportDetail, ReportListItem, ReportStatusFilter } from "@/admin/types/reportManagementType";
import { getReportDetail, getReportImages, getReportList, softDeleteReports, submitReportProcess } from "@/admin/services/reportManagementApi";
import { usePaginator } from "@/global/hooks/usePaginator";
import { showModal } from "@/global/utils/showModal";
import { REPORT_TARGET_TYPE, REPORT_STATUS } from "@/admin/enums/reportManagementEnums";

export function useReportManagement() {
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [status, setStatus] = useState<ReportStatusFilter>("");
  const [keyword, setKeyword] = useState("");

  const [items, setItems] = useState<ReportListItem[]>([]);
  const [total, setTotal] = useState(0);
  const current = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const allChecked = useMemo(
    () => items.length > 0 && items.every((x) => selected.has(x.reportId)),
    [items, selected]
  );

  const selectedCount = useMemo(() => selected.size, [selected]);
  const deleteDisabled = useMemo(() => selectedCount === 0, [selectedCount]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);

  const [detail, setDetail] = useState<ReportDetail | null>(null);
  const [detailImageUrl, setDetailImageUrl] = useState<string | null>(null);

  const [currentReportId, setCurrentReportId] = useState<number | null>(null);
  const [currentTargetMemberId, setCurrentTargetMemberId] = useState<string | null>(null);

  const [adminMemo, setAdminMemo] = useState("");
  const [stopDays, setStopDays] = useState<number>(0);

  const pagerRef = useRef<HTMLUListElement | null>(null);

  const loadList = useCallback(
    async (nextOffset?: number) => {
      const effectiveOffset = typeof nextOffset === "number" ? nextOffset : offset;

      setLoading(true);
      try {
        const data = await getReportList({
          keyword,
          status,
          limit,
          offset: effectiveOffset,
        });

        const nextTotal = data.total;
        const nextItems = data.items;

        const totalPages = Math.max(1, Math.ceil(nextTotal / limit));
        const nextCurrent = Math.floor(effectiveOffset / limit) + 1;

        if (nextCurrent > totalPages) {
          const correctedOffset = (totalPages - 1) * limit;
          setOffset(correctedOffset);
          return;
        }

        setItems(nextItems);
        setTotal(nextTotal);
        setSelected(new Set());
      } finally {
        setLoading(false);
      }
    },
    [keyword, status, limit, offset]
  );

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    setOffset(0);
    loadList(0);
  }, [status]);

  usePaginator({
    containerRef: pagerRef,
    current,
    totalItems: total,
    pageSize: limit,
    onChange: (page) => {
      const nextOffset = (page - 1) * limit;
      setOffset(nextOffset);
      loadList(nextOffset);
    },
  });

  const onSearch = useCallback(() => {
    setOffset(0);
    loadList(0);
  }, [loadList]);

  const toggleAll = useCallback(() => {
    if (allChecked) {
      setSelected(new Set());
      return;
    }
    const s = new Set<number>();
    items.forEach((x) => s.add(x.reportId));
    setSelected(s);
  }, [allChecked, items]);

  const toggleOne = useCallback((id: number) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const openDetail = useCallback(async (reportId: number) => {
    const d = await getReportDetail(reportId);
    setDetail(d);

    const imgs = await getReportImages({ targetType: REPORT_TARGET_TYPE, targetId: reportId });
    setDetailImageUrl(imgs?.[0]?.fileUrl ?? null);

    setDetailOpen(true);
  }, []);

  const openProcess = useCallback((reportId: number, targetMemberId?: string | null) => {
    setCurrentReportId(reportId);
    setCurrentTargetMemberId(targetMemberId ?? null);
    setAdminMemo("");
    setStopDays(0);
    setProcessOpen(true);
  }, []);

  const onSubmitProcess = useCallback(async () => {
    if (!currentReportId || !currentTargetMemberId) return;

    const memo = adminMemo.trim();
    if (!memo) return;

    let ok = false;

    if (stopDays == 0) {
      ok = await showModal.confirm(`[ id:${currentTargetMemberId} ]회원 정지를 해제하시겠습니까?`);
    } else {
      ok = await showModal.confirm(`[ id:${currentTargetMemberId} ]회원을 ${stopDays}일 동안 정지하시겠습니까?`);
    }
    if (!ok) return;

    await submitReportProcess(currentReportId, {
      targetMemberId: currentTargetMemberId,
      adminMemo: memo,
      stopDays,
    });

    setProcessOpen(false);
    await loadList();
  }, [currentReportId, currentTargetMemberId, adminMemo, stopDays, loadList]);

  const onDeleteSelected = useCallback(async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;

    const ok = await showModal.confirm(`선택한 ${ids.length}개 신고 내역을 삭제하시겠습니까?`);
    if (!ok) return;

    await softDeleteReports({ ids });
    setSelected(new Set());
    await loadList();
  }, [selected, loadList]);

  const isDone = useCallback((statusValue: ReportListItem["status"]) => {
    if (typeof statusValue === "boolean") return statusValue;
    return statusValue === REPORT_STATUS.DONE;
  }, []);

  return {
    filter: { status, setStatus, keyword, setKeyword, onSearch },
    table: {
      items, loading, selected, allChecked,
      toggleAll, toggleOne,
      openDetail, openProcess,
      isDone,
      deleteDisabled,
    },
    pager: { pagerRef },
    modal: {
      detailOpen, setDetailOpen,
      processOpen, setProcessOpen,
      detail, detailImageUrl,
      adminMemo, setAdminMemo,
      stopDays, setStopDays,
      currentReportId,
      currentTargetMemberId,
    },
    actions: { onDeleteSelected, onSubmitProcess },
  };

}
