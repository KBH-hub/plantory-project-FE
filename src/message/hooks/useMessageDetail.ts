import { useEffect, useState } from "react";
import { getMessageDetail } from "@/message/services/messageService";
import type { MessageDetailResponse } from "@/message/types/message";

export function useMessageDetail(messageId: number | null) {
  const [detail, setDetail] = useState<MessageDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    if (!messageId) {
      setLoading(false);
      setDetail(null);
      return;
    }

    setLoading(true);

    getMessageDetail(messageId)
      .then((res) => {
        if (!alive) return;
        setDetail(res ?? null);
      })
      .catch((e) => {
        if (!alive) return;
        console.error(e);
        setDetail(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [messageId]);

  return { detail, loading };
}
