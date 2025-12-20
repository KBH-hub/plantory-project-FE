import type { SearchResult } from "@/report/hooks/useReport";

type Props = {
  keyword: string;
  loading: boolean;
  results: SearchResult[];
  onChangeKeyword: (v: string) => void;
  onSearch: () => void;
  onChoose: (m: SearchResult) => void;
  onClose: () => void;
};

export default function MemberSearchModal({
  keyword,
  loading,
  results,
  onChangeKeyword,
  onSearch,
  onChoose,
  onClose,
}: Props) {
  return (
    <div className="modal fade" id="memberSearchModal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">회원 검색</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={onClose} aria-label="Close" />
          </div>

          <div className="modal-body">
            <div className="mb-3">
              <label className="fw-bold">피신고자 닉네임 *</label>
              <div className="d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="닉네임 입력"
                  value={keyword}
                  onChange={(e) => onChangeKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                />
                <button
                  className="btn btn-dark"
                  style={{ minWidth: 70 }}
                  onClick={onSearch}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "검색중..." : "검색"}
                </button>
              </div>
            </div>

            <div className="table-responsive mt-4">
              <table className="table align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>닉네임</th>
                    <th>회원 선택</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-secondary">
                        결과가 없습니다.
                      </td>
                    </tr>
                  )}

                  {results.map((m) => (
                    <tr key={m.id}>
                      <td>{m.nickname}</td>
                      <td>
                        <button className="btn btn-outline-dark btn-sm" onClick={() => onChoose(m)} type="button">
                          선택
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary w-25" data-bs-dismiss="modal" onClick={onClose}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
