import React from "react";
import type { BoxType, TargetType } from "@/message/enums/messageEnum";
import type { MessageListResponse } from "@/message/types/messageType";
import MessageItem from "@/message/components/MessageItem";

type Props = {
  boxType: BoxType;
  data: MessageListResponse[];
  total: number | null;
  loading: boolean;

  draftTitle: string;
  draftTargetType: TargetType | "";
  onChangeDraftTitle: (v: string) => void;
  onChangeDraftTargetType: (v: TargetType | "") => void;
  onSubmitSearch: (e: React.FormEvent) => void;

  onTabClick: (next: BoxType) => void;
  onDeleteSelected: () => void;
  deleteDisabled: boolean;

  checkAllRef: React.RefObject<HTMLInputElement | null>;
  allChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  selectedIds: number[];
  onToggleRow: (id: number, checked: boolean) => void;
  onRowClick: (messageId: number) => void;

  pagerRef: React.RefObject<HTMLUListElement | null>;
};

export function MessageListView({
  boxType,
  data,
  loading,

  draftTitle,
  draftTargetType,
  onChangeDraftTitle,
  onChangeDraftTargetType,
  onSubmitSearch,

  onTabClick,
  onDeleteSelected,
  deleteDisabled,

  checkAllRef,
  allChecked,
  onToggleAll,
  selectedIds,
  onToggleRow,
  onRowClick,

  pagerRef,
}: Props) {
  return (
    <div className="bg-light">
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
                    onClick={(e) => {
                      e.preventDefault();
                      onTabClick("RECEIVED");
                    }}
                  >
                    받은 쪽지
                  </a>

                  <span className="text-secondary">|</span>

                  <a
                    href="#"
                    className={`link-secondary text-decoration-none ${boxType === "SENT" ? "fw-semibold" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onTabClick("SENT");
                    }}
                  >
                    보낸 쪽지
                  </a>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={onDeleteSelected}
                    disabled={deleteDisabled}
                  >
                    선택 삭제
                  </button>
                </div>
              </div>

              <div className="col-auto">
                <form className="d-flex align-items-center gap-2" onSubmit={onSubmitSearch}>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: 110 }}
                    value={draftTargetType}
                    onChange={(e) => onChangeDraftTargetType(e.target.value as TargetType | "")}
                  >
                    <option value="">전체</option>
                    <option value="SHARING">나눔</option>
                    <option value="QUESTION">질문</option>
                  </select>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="제목 검색"
                    style={{ width: 220 }}
                    value={draftTitle}
                    onChange={(e) => onChangeDraftTitle(e.target.value)}
                  />

                  <button className="btn btn-secondary btn-sm" type="submit" disabled={loading}>
                    {loading ? "검색중..." : <i className="bi bi-search" />}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 table-fixed text-center align-middle">
                <thead className="table-light small">
                  <tr>
                    <th className="text-center" style={{ width: 44 }}>
                      <input
                        ref={checkAllRef}
                        className="form-check-input"
                        type="checkbox"
                        aria-label="전체선택"
                        checked={allChecked}
                        onChange={(e) => onToggleAll(e.target.checked)}
                        disabled={data.length === 0}
                      />
                    </th>
                    <th className="text-nowrap" style={{ width: 96 }}>
                      수신자 읽음 상태
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
                    <th style={{ width: 350 }}>제목</th>
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
                    onToggleRow={onToggleRow}
                    onRowClick={onRowClick}
                  />
                </tbody>
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
