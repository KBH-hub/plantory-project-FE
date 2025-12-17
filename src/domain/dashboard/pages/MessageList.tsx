import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMessageList, getMessageDetail } from "@/domain/services/messageService";
import type { MessageListResponse } from "@/global/types/message/message";
import { createPaginator } from "@/global/utils/pagination";

export default function MessageList() {
  const navigate = useNavigate();
  const [data, setData] = useState<MessageListResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState<number | null>(null);

  const pagerRef = useRef<HTMLUListElement | null>(null);
  const paginatorRef = useRef<{ update: (p?: any) => void } | null>(null);

  const current = Math.floor(offset / limit) + 1;

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const checkAllRef = useRef<HTMLInputElement | null>(null);
  const allChecked = data.length > 0 && selectedIds.size === data.length;
  const someChecked = selectedIds.size > 0 && selectedIds.size < data.length;

  useEffect(() => {
    if (!checkAllRef.current) return;
    checkAllRef.current.indeterminate = someChecked;
  }, [someChecked]);

  const toggleRow = (id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(data.map((it) => it.messageId)));
  };

  useEffect(() => {
    let alive = true;
    // setLoading(true);

    getMessageList({ boxType: "RECEIVED", offset, limit })
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
  }, [offset, limit]);

  useEffect(() => {
    if (loading) return;
    if (!pagerRef.current) return;
    if (paginatorRef.current) return;

    paginatorRef.current = createPaginator({
      container: pagerRef.current,
      current,
      totalItems: total,
      pageSize: limit,
      windowSize: 5,
      modeWhenUnknown: "next-only",
      onChange: (page: number) => {
        setOffset((page - 1) * limit);
      },
    });
  }, [loading]);

  useEffect(() => {
    if (!paginatorRef.current) return;

    paginatorRef.current.update({
      current,
      totalItems: total,
      pageSize: limit,
    });
  }, [current, total, limit]);

  if (loading) return <div>로딩중...</div>;
  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const se = String(d.getSeconds()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${se}`;
  };

  const labelTargetType = (t: string) => {
    switch (t) {
      case "SHARING":
        return "나눔";
      case "QUESTION":
        return "질문";
      default:
        return t ?? "";
    }
  };

  const messageTbody = (
    <>
      {data.length === 0 ? (
        <tr>
          <td colSpan={8} className="text-center text-muted py-4">
            쪽지가 없습니다.
          </td>
        </tr>
      ) : (
        data.map((item) => {
          const isUnread = !item.readFlag;
          const rowClass = `cursor-pointer${isUnread ? " fw-semibold" : ""}`;
          const readText = item.readFlag ? "읽음" : "안읽음";
          const category = labelTargetType(item.targetType);
          const relatedText = item.targetTitle || "(삭제된 쪽지)";

          return (
            <tr
              key={item.messageId}
              data-id={item.messageId}
              className={rowClass}
              onClick={() => navigate(`/messageDetail/${item.messageId}`)}
            >
              <td className="text-center" style={{ width: 44 }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedIds.has(item.messageId)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => toggleRow(item.messageId, e.target.checked)}
                />
              </td>

              <td style={{ width: 96 }}>{readText}</td>
              <td style={{ width: 120 }}>{item.senderNickname ?? ""}</td>
              <td style={{ width: 120 }}>{item.receiverNickname ?? ""}</td>
              <td style={{ width: 90 }}>{category}</td>

              <td className="text-truncate" style={{ maxWidth: 180 }}>
                {item.title || ""}
              </td>

              <td className="text-truncate">{relatedText}</td>

              <td className="text-nowrap" style={{ width: 170 }}>
                {formatDateTime(item.createdAt)}
              </td>
            </tr>
          );
        })
      )}
    </>
  );

  return (
    <div className="bg-light" data-member-id="">
      <div className="container-xxl py-4">
        <h5 className="fw-bold mb-3">쪽지함</h5>

        <div className="card shadow-sm" style={{ height: 600 }}>
          <div className="card-header">
            <div className="row g-2 align-items-center">
              <div className="col d-flex flex-wrap align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <a
                    href="#"
                    id="tabReceived"
                    className="link-secondary text-decoration-none fw-semibold"
                    data-box="RECEIVED"
                    onClick={(e) => e.preventDefault()}
                  >
                    받은 쪽지
                  </a>
                  <span className="text-secondary">|</span>
                  <a
                    href="#"
                    id="tabSent"
                    className="link-secondary text-decoration-none"
                    data-box="SENT"
                    onClick={(e) => e.preventDefault()}
                  >
                    보낸 쪽지
                  </a>

                  <button id="btnDelete" className="btn btn-outline-danger btn-sm" type="button">
                    선택 삭제
                  </button>
                </div>
              </div>

              <div className="col-auto">
                <form id="searchForm" className="d-flex align-items-center gap-2">
                  <select
                    id="selectTargetType"
                    className="form-select form-select-sm"
                    style={{ width: 110 }}
                    defaultValue=""
                  >
                    <option value="">전체</option>
                    <option value="SHARING">나눔</option>
                    <option value="QUESTION">질문</option>
                  </select>

                  <input
                    id="inputTitle"
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="제목 검색"
                    style={{ width: 220 }}
                  />

                  <button className="btn btn-secondary btn-sm" type="submit">
                    <i className="bi bi-search" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 table-fixed">
                <thead className="table-light small">
                  <tr>
                    <th className="text-center" style={{ width: 44 }}>
                      <input
                        ref={checkAllRef}
                        className="form-check-input"
                        type="checkbox"
                        aria-label="전체선택"
                        checked={allChecked}
                        onChange={(e) => toggleAll(e.target.checked)}
                        disabled={data.length === 0}
                      />
                    </th>
                    <th className="text-nowrap" style={{ width: 96 }}>
                      읽음 상태
                    </th>
                    <th className="text-nowrap" style={{ width: 120 }}>
                      보낸 사람
                    </th>
                    <th className="text-nowrap" style={{ width: 120 }}>
                      받는 사람
                    </th>
                    <th className="text-nowrap" style={{ width: 90 }}>
                      카테고리
                    </th>
                    <th style={{ width: 300 }}>제목</th>
                    <th>관련글</th>
                    <th className="text-nowrap" style={{ width: 170 }}>
                      시간
                    </th>
                  </tr>
                </thead>

                <tbody id="messageTbody">{messageTbody}</tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-center py-3">
            <nav aria-label="쪽지함 페이지">
              <ul className="pagination pagination-sm mb-0" ref={pagerRef}></ul>
            </nav>
          </div>
        </div>
      </div>

    </div>
  );
}
