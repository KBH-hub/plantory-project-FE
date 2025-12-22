import type { noticeType } from "@/notice/types/noticeType";

export function buildNoticeHref(n: noticeType): string {
  const id = (n as any)?.targetId;
  switch (String((n as any)?.targetType || "")) {
    case "SHARING":
      return `/sharing/${id}`;
    case "SHARING_REVIEW":
      return `/sharing/${id}/review`;
    case "QUESTION":
      return `/question/${id}`;
    case "MESSAGE":
      return `/messageDetail/${id}`;
    case "WATERING":
      return `/plantCalendar`;
    default:
      return "#";
  }
}
