import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageItem from "@/domain/message/components/MessageItem";
import { useMessageListQuery } from "@/domain/message/hooks/useMessageListQuery";
import { usePaginator } from "@/domain/message/hooks/usePaginator";
import { useIndeterminate } from "@/domain/message/hooks/useIndeterminate";
import { BoxType } from "@/domain/message/enum/messageTypes";

export default function MessageList() {
  const navigate = useNavigate();

  const [boxType, setBoxType] = useState<BoxType>("RECEIVED");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, total, loading } = useMessageListQuery({
    boxType,
    offset,
    limit,
  });

  const current = Math.floor(offset / limit) + 1;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const checkAllRef = useRef<HTMLInputElement | null>(null);
  const pagerRef = useRef<HTMLUListElement | null>(null);

  const allChecked = data.length > 0 && selectedIds.length === data.length;
  const someChecked = selectedIds.length > 0 && selectedIds.length < data.length;

  useIndeterminate(checkAllRef, someChecked);

  const handleTabClick = useCallback((next: BoxType) => {
    setBoxType(next);
    setOffset(0);          // 페이지 리셋
    setSelectedIds([]);    // 선택 상태도 리셋 권장
  }, []);

  const toggleRow = useCallback((id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((v) => v !== id);
    });
  }, []);

  const toggleAll = useCallback((checked: boolean) => {
    if (!checked) return setSelectedIds([]);
    setSelectedIds(data.map((it) => it.messageId));
  }, [data]);

  const handleRowClick = useCallback(
    (messageId: number) => navigate(`/messageDetail/${messageId}`),
    [navigate]
  );

  usePaginator({
    containerRef: pagerRef,
    current,
    totalItems: total,
    pageSize: limit,
    onChange: (page) => setOffset((page - 1) * limit),
  });

  if (loading) return <div>로딩중...</div>;
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
                    className={`link-secondary text-decoration-none ${boxType === "RECEIVED" ? "fw-semibold" : ""}`}
                    onClick={(e) => { e.preventDefault(); handleTabClick("RECEIVED"); }}
                  >
                    받은 쪽지
                  </a>

                  <span className="text-secondary">|</span>

                  <a
                    href="#"
                    className={`link-secondary text-decoration-none ${boxType === "SENT" ? "fw-semibold" : ""}`}
                    onClick={(e) => { e.preventDefault(); handleTabClick("SENT"); }}
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

                <tbody>
                  <MessageItem
                    data={data}
                    selectedIds={selectedIds}
                    onToggleRow={toggleRow}
                    onRowClick={handleRowClick}
                  /></tbody>
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
