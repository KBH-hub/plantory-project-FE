import { useMemo, useState } from "react";
import type { ReplyForm, MessageRegisterRequest, MessageDetailResponse } from "@/domain/message/types/message";
import { buildReplyForm } from "@/domain/message/utils/buildReplyForm";
import { showModal } from "@/global/utils/showModal";

type Params = {
  detail: MessageDetailResponse | null | undefined;
  send: (payload: MessageRegisterRequest) => Promise<unknown>;
  onSuccess?: () => void;
};

export function useReplyModal({ detail, send, onSuccess }: Params) {
  const [isOpen, setIsOpen] = useState(false);
  const [reply, setReply] = useState<ReplyForm>({
    to: "(삭제된 쪽지)",
    post: "삭제된 쪽지입니다.",
    title: "(삭제된 쪽지)",
    content: "",
  });

  const canReply = useMemo(() => !!detail, [detail]);

  const open = () => {
    setReply(buildReplyForm(detail));
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const setTitle = (title: string) => setReply((p) => ({ ...p, title }));
  const setContent = (content: string) => setReply((p) => ({ ...p, content }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;

    const payload: MessageRegisterRequest = {
      receiverId: detail.senderId,
      title: reply.title.trim(),
      content: reply.content.trim(),
      targetType: detail.targetType ?? undefined,
      targetId: detail.targetId ?? undefined,
    };

    const ok = await showModal.confirm("쪽지를 전송하시겠습니까?");
    if (!ok) return;

    try {
      await send(payload);
      await showModal.alert("전송하였습니다");
      close();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "알 수 없는 오류";

      await showModal.alert(`전송 실패: ${msg}`);
    }
  };

  return {
    canReply,
    isOpen,
    reply,
    open,
    close,
    submit,
    setTitle,
    setContent,
  };
}
