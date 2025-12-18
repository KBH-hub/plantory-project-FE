import { useCallback, useState } from "react";
import { registerMessage } from "@/domain/message/services/messageService";
import type { MessageRegisterRequest } from "@/domain/message/types/message";

type Options = {
  confirm?: (msg: string) => Promise<boolean>;
  alert?: (msg: string) => void;
  onSuccess?: () => void;
};

export function useRegisterMessage(options?: Options) {
  const [isSending, setIsSending] = useState(false);

  const send = useCallback(
    async (payload: MessageRegisterRequest) => {
      if (isSending) return false;

      if (!payload.receiverId) throw new Error("수신자 정보가 없습니다.");
      if (!payload.title?.trim()) throw new Error("제목이 비어 있습니다.");
      if (!payload.content?.trim()) throw new Error("내용이 비어 있습니다.");
      if (!payload.targetType) throw new Error("유효하지 않은 관련 글 유형입니다.");
      if (!payload.targetId) throw new Error("유효하지 않은 관련 글입니다.");

      const ok = options?.confirm ? await options.confirm("쪽지를 보내시겠습니까?") : true;
      if (!ok) return false;

      try {
        setIsSending(true);
        await registerMessage(payload);
        options?.onSuccess?.();
        options?.alert?.("쪽지를 보냈습니다.");
        return true;
      } finally {
        setIsSending(false);
      }
    },
    [isSending, options]
  );

  return { isSending, send };
}
