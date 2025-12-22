import { ModalShell } from "@/admin/components/ModalShell";

export function ReportProcessModal({
  open,
  onClose,
  adminMemo,
  setAdminMemo,
  stopDays,
  setStopDays,
  disabled,
  hasTargetMember,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  adminMemo: string;
  setAdminMemo: (v: string) => void;
  stopDays: number;
  setStopDays: (v: number) => void;
  disabled: boolean;
  hasTargetMember: boolean;
  onSubmit: () => void;
}) {
  return (
    <ModalShell open={open} onClose={onClose}>
      <div className="modal-header bg-white border-bottom">
        <h5 className="modal-title fw-bold">신고 처리</h5>
        <button className="btn-close" onClick={onClose} type="button" />
      </div>

      <div className="modal-body">
        <label className="fw-semibold mb-1">처리의견 *</label>
        <textarea className="form-control mb-3" placeholder="처리 의견 입력" value={adminMemo} onChange={(e) => setAdminMemo(e.target.value)} />

        <label className="fw-semibold mb-1">활동정지 기간 *</label>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select" value={stopDays} onChange={(e) => setStopDays(Number(e.target.value))}>
            <option value={0}>정지해제</option>
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={7}>7</option>
            <option value={14}>14</option>
            <option value={28}>28</option>
          </select>
        </div>

        <div className="mt-2">
          {!adminMemo.trim() ? <small className="text-danger">처리 의견을 입력해주세요.</small> : null}
          {!hasTargetMember ? <small className="text-danger d-block">피신고자 아이디가 없어 처리를 진행할 수 없습니다.</small> : null}
        </div>
      </div>

      <div className="modal-footer border-0 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={onClose} type="button">
          취소
        </button>

        <button className="btn btn-success" onClick={onSubmit} disabled={disabled} type="button">
          처리완료
        </button>
      </div>
    </ModalShell>
  );
}
