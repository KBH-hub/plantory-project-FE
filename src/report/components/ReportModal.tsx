import type { RefObject } from "react";

type Props = {
  reportTargetNickname: string;
  reportTargetId: string;
  reportContent: string;
  reportPreview: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onOpenMemberSearch: () => void;
  onChangeContent: (v: string) => void;
  onPickFiles: (files: File[]) => void;
  onSubmit: () => void;
};

export default function ReportModal({
  reportTargetNickname,
  reportTargetId,
  reportContent,
  reportPreview,
  fileInputRef,
  onOpenMemberSearch,
  onChangeContent,
  onPickFiles,
  onSubmit,
}: Props) {
  return (
    <div className="modal fade" id="reportModal" tabIndex={-1} data-bs-backdrop="static" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">신고하기</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>

          <div className="modal-body">
            <label className="fw-bold">피신고자 닉네임 *</label>
            <div className="d-flex gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                readOnly
                placeholder="회원검색을 통해 선택하세요"
                value={reportTargetNickname}
              />
              <button type="button" className="btn btn-dark" onClick={onOpenMemberSearch} style={{ minWidth: 90 }}>
                회원검색
              </button>
            </div>

            <input type="hidden" name="targetMemberId" value={reportTargetId} />

            <label className="fw-bold">내용 *</label>
            <textarea
              className="form-control mb-3"
              rows={4}
              placeholder="신고 내용을 입력하세요."
              value={reportContent}
              onChange={(e) => onChangeContent(e.target.value)}
            />

            <label className="fw-bold d-block">근거사진 *</label>
            <div
              className="border rounded d-flex justify-content-center align-items-center"
              style={{ width: 120, height: 120, cursor: "pointer" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {!reportPreview && <i className="bi bi-camera fs-2 text-secondary" />}
              {reportPreview && (
                <img
                  style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
                  src={reportPreview}
                  alt="report"
                />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={fileInputRef as any}
              multiple
              onChange={(e) => onPickFiles(Array.from(e.target.files ?? []))}
            />

            <p className="text-danger small mt-2">* 허위신고 시 불이익이 있을 수 있습니다.</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" type="button" data-bs-dismiss="modal">
              취소
            </button>
            <button className="btn btn-success" type="button" onClick={onSubmit}>
              신고하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
