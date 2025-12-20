import type { notice } from "@/notice/types/notice";

export function buildNoticeHref(n: notice): string {
  const id = (n as any)?.targetId;
  switch (String((n as any)?.targetType || "")) {
    case "SHARING":
      return `/readSharing/${id}`;
    case "SHARING_REVIEW":
      return `/sharing/${id}/review`;
    case "QUESTION":
      return `/readQuestion/${id}`;
    case "MESSAGE":
      return `/messageDetail/${id}`;
    case "WATERING":
      return `/plantCalendar`;
    default:
      return "#";
  }
}
