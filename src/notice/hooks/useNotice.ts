import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNoticeList, markNoticeRead, removeAllNotice } from "@/notice/services/noticeApi";
import { showModal } from "@/global/utils/showModal";
import type { noticeType } from "@/notice/types/noticeType";
import { buildNoticeHref } from "@/notice/utils/buildNoticeHref";
import { useLocation } from "react-router-dom";

export function useNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const [alarms, setAlarms] = useState<noticeType[]>([]);

  const alarmCount = alarms.length;

  const refresh = useCallback(async () => {
    try {
      const data = await getNoticeList();
      const mapped: noticeType[] = (data ?? []).map((n: noticeType) => ({
        ...n,
        href: (n as any).href ?? buildNoticeHref(n),
      }));
      setAlarms(mapped);
    } catch (e) {
      console.error(e);
      setAlarms([]);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const moveNotice = useCallback(
    async (noticeId: number, href: string) => {
      try {
        await markNoticeRead(noticeId);
      } finally {
        navigate(href);
      }
    },
    [navigate]
  );

  useEffect(() => {
    refresh();
  }, [location.key, refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const clearAllNotice = useCallback(async () => {
    const ok = await showModal.confirm("알림을 모두 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await removeAllNotice();
      setAlarms([]);
      await showModal.alert("삭제되었습니다");
    } catch (e) {
      console.error(e);
      await showModal.alert("알림 삭제 중 오류가 발생했습니다.");
    }
  }, []);

  return useMemo(
    () => ({
      alarms,
      alarmCount,
      refresh,
      moveNotice,
      clearAllNotice,
    }),
    [alarms, alarmCount, refresh, moveNotice, clearAllNotice]
  );
}
