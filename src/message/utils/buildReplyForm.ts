import type { ReplyForm } from "@/message/types/message";
import type { MessageDetailResponse } from "@/message/types/message"; // 실제 타입명으로 수정

export function buildReplyForm(detail?: MessageDetailResponse | null): ReplyForm {
  const to = detail?.senderNickname || String(detail?.senderId ?? "") || "(삭제된 쪽지)";
  const post = detail?.targetTitle || "삭제된 쪽지입니다.";
  const title = detail?.title
    ? (detail.title.startsWith("Re:") ? detail.title : `Re: ${detail.title}`)
    : "(삭제된 쪽지)";

  const original = detail?.content ?? "";
  const presetContent = original ? `\n\n----- 원문 -----\n${original}` : "";

  return { to, post, title, content: presetContent };
}
