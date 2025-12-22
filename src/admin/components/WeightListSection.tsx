import type { RefObject } from "react";
import type { WeightListItemUI, WeightWeightsLatest } from "@/admin/types/weightManagementType";

type Props = {
  items: WeightListItemUI[];
  pagerRef: RefObject<HTMLUListElement | null>;
  latest: WeightWeightsLatest | null;
};

export default function WeightListSection({ items, pagerRef, latest }: Props) {
  return (
    <>
      <div className="table-container bg-light">
        <table className="table table-hover mb-0 text-center align-middle">
          <thead className="table-secondary small">
            <tr>
              <th>아이디</th>
              <th>닉네임</th>
              <th>검색어 수</th>
              <th>질문글 수</th>
              <th>관심 필요 식물 수(최근 7일)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted">
                  <i className="bi bi-box fs-2" />
                  <div>데이터가 없습니다.</div>
                </td>
              </tr>
            ) : (
              items.map((m) => (
                <tr key={m.memberId} className="user-row" data-member-id={m.memberId}>
                  <td>{m.membername}</td>
                  <td>{m.nickname}</td>
                  <td>{(m.searchWeight * 10).toFixed(0)}</td>
                  <td>{(m.questionWeight * 10).toFixed(0)}</td>
                  <td>{m.plantsNeedingAttention > 0 ? m.plantsNeedingAttention : 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <ul ref={pagerRef} className="pagination" />
      </div>

      {latest ? (
        <div className="small text-muted mt-2">
          현재 저장된 비중: 검색어 {(latest.searchWeight * 10).toFixed(0)} / 질문수{" "}
          {(latest.questionWeight * 10).toFixed(0)}
        </div>
      ) : null}
    </>
  );
}
