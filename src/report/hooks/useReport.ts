import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchUserByNickname, registerReport } from "@/report/services/reportService";
import { showModal } from "@/global/utils/showModal";
import { useBootstrapModal } from "@/global/hooks/useBootstrapModal";

export type SearchResult = { id: number | string; nickname: string };

export function useReportFlow() {
  const reportModal = useBootstrapModal("reportModal");
  const memberSearchModal = useBootstrapModal("memberSearchModal");

  const [reportTarget, setReportTarget] = useState<{ id: string | number | null; nickname: string }>({
    id: null,
    nickname: "",
  });
  const [reportContent, setReportContent] = useState("");
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [reportPreview, setReportPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const restoreReportModalRef = useRef(false);

  useEffect(() => {
    if (!reportFiles.length) {
      setReportPreview("");
      return;
    }
    const url = URL.createObjectURL(reportFiles[0]);
    setReportPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [reportFiles]);

  const openReportModal = useCallback(() => {
    reportModal.open();
  }, [reportModal]);

  const openMemberSearchModal = useCallback(() => {
    setKeyword("");
    setResults([]);
    setLoadingSearch(false);

    const reportWasOpen = reportModal.shown();
    restoreReportModalRef.current = reportWasOpen;

    if (reportWasOpen) reportModal.close();

    memberSearchModal.on("shown.bs.modal", () => {
      const el = memberSearchModal.getEl();
      const input = el?.querySelector("input") as HTMLInputElement | null;
      input?.focus();
    });

    memberSearchModal.open();
  }, [memberSearchModal, reportModal]);

  const closeMemberSearchModal = useCallback(() => {
    memberSearchModal.close();
  }, [memberSearchModal]);

  useEffect(() => {
    const off = memberSearchModal.on("hidden.bs.modal", () => {
      if (!restoreReportModalRef.current) return;
      restoreReportModalRef.current = false;
      reportModal.open();
    });
    return off;
  }, [memberSearchModal, reportModal]);

  const searchMember = useCallback(async () => {
    const q = keyword.trim();
    if (!q) {
      setResults([]);
      return;
    }

    try {
      setLoadingSearch(true);
      const data = await searchUserByNickname(q);
      const mapped: SearchResult[] = (data ?? []).map((m: any) => ({
        id: m.memberId,
        nickname: m.nickname,
      }));
      setResults(mapped);
    } catch (e) {
      console.error(e);
      await reportModal.withHidden(() => showModal.alert("검색 중 오류가 발생했습니다."));
      setResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [keyword, reportModal]);

  const chooseMember = useCallback(
    (m: SearchResult) => {
      setReportTarget({ id: m.id, nickname: m.nickname });
      closeMemberSearchModal();
    },
    [closeMemberSearchModal]
  );

  const resetReport = useCallback(() => {
    setReportTarget({ id: null, nickname: "" });
    setReportContent("");
    setReportFiles([]);
    setReportPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const submitReport = useCallback(async () => {
    const targetMemberId = reportTarget.id;
    const content = reportContent.trim();

    if (!targetMemberId) {
      await reportModal.withHidden(() => showModal.alert("피신고자를 선택해 주세요."));
      return;
    }
    if (!content) {
      await reportModal.withHidden(() => showModal.alert("신고 내용을 입력해 주세요."));
      return;
    }
    if (!reportFiles.length) {
      await reportModal.withHidden(() => showModal.alert("근거 사진을 1장 이상 첨부하세요."));
      return;
    }

    const fd = new FormData();
    fd.append("targetMemberId", String(targetMemberId));
    fd.append("content", content);
    reportFiles.forEach((f) => fd.append("files", f));

    try {
      const ok = await reportModal.withHidden(() => showModal.confirm("신고를 등록하시겠습니까?"), { restore: false });
      if (!ok) return;

      await registerReport(fd);

      await reportModal.withHidden(() => showModal.alert("신고가 등록되었습니다."), { restore: false });

      resetReport();
      reportModal.close();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "신고 등록에 실패했습니다.";
      await reportModal.withHidden(() => showModal.alert(msg));
    }
  }, [reportContent, reportFiles, reportModal, reportTarget.id, resetReport]);

  return useMemo(
    () => ({
      reportModal,
      memberSearchModal,

      reportTarget,
      setReportTarget,

      reportContent,
      setReportContent,

      reportFiles,
      setReportFiles,

      reportPreview,
      fileInputRef,

      keyword,
      setKeyword,
      results,
      loadingSearch,

      openReportModal,
      openMemberSearchModal,
      closeMemberSearchModal,

      searchMember,
      chooseMember,

      submitReport,
      resetReport,
    }),
    [
      reportModal,
      memberSearchModal,
      reportTarget,
      reportContent,
      reportFiles,
      reportPreview,
      keyword,
      results,
      loadingSearch,
      openReportModal,
      openMemberSearchModal,
      closeMemberSearchModal,
      searchMember,
      chooseMember,
      submitReport,
      resetReport,
    ]
  );
}
