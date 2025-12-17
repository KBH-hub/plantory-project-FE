import { useEffect, useState } from "react";
import { getMessageList } from "@/domain/message/services/messageService";
import type { MessageListResponse, MessageSearchRequest } from "@/domain/message/types/message";

export function useMessageListQuery(params: MessageSearchRequest) {
  const [data, setData] = useState<MessageListResponse[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    getMessageList(params)
      .then((res) => {
        if (!alive) return;
        const items = Array.isArray(res) ? res : [];
        const tc = Number(items[0]?.totalCount);
        setData(items);
        setTotal(Number.isFinite(tc) ? tc : null);
      })
      .catch((e) => {
        if (!alive) return;
        console.error(e);
        setData([]);
        setTotal(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params.boxType, params.offset, params.limit, params.targetType, params.title]);

  return { data, total, loading };
}