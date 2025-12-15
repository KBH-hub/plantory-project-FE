import { useEffect, useMemo, useState } from "react";
import { MessageService } from "../services/messageService";
import type { MessageItem, TargetType } from "../types/message";
import { useAuthStore } from "../stores/useAuthStore";
// import { formatKST } from "../utils/datetime";

const TARGET_TYPES: (TargetType | "ALL")[] =
  ["ALL", "SHARING", "QUESTION", "REPORT", "MYPLANT", "DIARY"];

export default function MessageList() {
  const user = useAuthStore((s) => s.user);
  const memberId = user?.memberId ?? 0;

  const [items, setItems] = useState<MessageItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [targetType, setTargetType] = useState<TargetType | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);
  const totalPages  = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const load = async () => {
    if (!memberId) return;
    setLoading(true);
    setError(null);
    try {
      const page = await MessageService.listByBox(memberId, "RECEIVED", {
        targetType,
        offset,
        limit,
      });
      setItems(page.items);
      setTotal(page.totalCount);
    } catch (e: any) {
      setError(e?.message ?? "목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, targetType, offset, limit]);

  const onChangeType = (val: string) => {
    setTargetType(val === "ALL" ? undefined : (val as TargetType));
    setOffset(0);
  };

  const go = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setOffset((p - 1) * limit);
  };

  if (!memberId) {
    return <div className="container py-4">로그인이 필요합니다.</div>;
  }

  return (
    <div className="container-xxl py-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="fw-bold mb-0">쪽지함 (받은 쪽지)</h5>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm"
            style={{ width: 180 }}
            value={targetType ?? "ALL"}
            onChange={(e) => onChangeType(e.target.value)}
          >
            {TARGET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: 90 }}
            value={String(limit)}
            onChange={(e) => { setLimit(Number(e.target.value)); setOffset(0); }}
          >
            {[10, 20, 50].map(n => <option key={n} value={n}>{n}/페이지</option>)}
          </select>
        </div>
      </div>

      {loading && <div className="alert alert-secondary">로딩 중…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="alert alert-light border">데이터가 없습니다.</div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="small text-muted mb-2">
            총 {total}건 · {currentPage}/{totalPages} 페이지
          </div>

          <ul className="list-group">
            {items.map((m) => (
              <li key={m.messageId} className="list-group-item d-flex justify-content-between align-items-start">
                <div className="me-3">
                  <div className="fw-bold">{m.title}</div>
                  <div className="text-muted small">
                    {m.senderNickname} → {m.receiverNickname} · {m.targetType} · {formatKST(m.createdAt)}
                  </div>
                  {m.targetTitle && <div className="small">{m.targetTitle}</div>}
                  {m.content && (
                    <div className="small text-body-secondary text-truncate" style={{ maxWidth: 520 }}>
                      {m.content}
                    </div>
                  )}
                </div>
                {!m.readFlag && <span className="badge text-bg-primary align-self-center">NEW</span>}
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-center gap-2 mt-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => go(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              이전
            </button>
            <span className="small align-self-center">
              {currentPage} / {totalPages}
            </span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => go(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}
    </div>
  );
}
