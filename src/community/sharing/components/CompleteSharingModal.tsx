import { SharingPartner } from "@/community/sharing/types/completeSharing";

type Step = "select" | "confirm" | "result";

interface Props {
  open: boolean;
  step: Step;

  partners: SharingPartner[];
  selected: SharingPartner | null;

  onSelect: (p: SharingPartner) => void;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  onGoReview: () => void;
}

function CompleteSharingModal({
  open,
  step,
  partners,
  selected,
  onSelect,
  onClose,
  onBack,
  onNext,
  onComplete,
  onGoReview,
}: Props) {
  if (!open) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block modal-fixed" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header border-0 pb-0">
              <h6 className="modal-title fw-semibold">
                {step === "select" && "나눔 완료 상대 선택"}
                {step === "confirm" && "나눔 완료"}
                {step === "result" && "나눔 완료 확인"}
              </h6>
            </div>

            <div className="modal-body">

              {step === "select" && (
                <>
                  <div className="small text-muted mb-2">
                    이 글에 대해 쪽지를 나눈 상대
                  </div>

                  {partners.length === 0 && (
                    <div className="text-muted small">
                      쪽지 기록이 없습니다.
                    </div>
                  )}

                  {partners.map((p, idx) => (
                    <div className="form-check" key={p.memberId}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="doneTarget"
                        id={`done-${idx}`}
                        checked={selected?.memberId === p.memberId}
                        onChange={() => onSelect(p)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`done-${idx}`}
                      >
                        {p.nickname}
                      </label>
                    </div>
                  ))}
                </>
              )}

              {step === "confirm" && (
                <>
                  <p className="mb-0">
                    <strong className="text-success">
                      {selected?.nickname}
                    </strong>
                    님과의 나눔을 완료하시겠습니까?
                  </p>
                  <small className="text-muted">
                    (나눔 완료 후, 취소는 불가능합니다)
                  </small>
                </>
              )}

              {step === "result" && (
                <>
                  <p className="mb-0">
                    <strong className="text-success">
                      {selected?.nickname}
                    </strong>
                    님과의 나눔이 완료되었습니다.
                  </p>
                  <small className="text-muted">
                    후기를 남겨 서로의 나눔지수를 올려보세요!
                  </small>
                </>
              )}

            </div>

            <div className="modal-footer border-0 pt-0">

              {step === "select" && (
                <>
                  <button className="btn btn-light" onClick={onClose}>
                    취소
                  </button>
                  <button className="btn btn-success" disabled={!selected} onClick={onNext}>
                    선택 완료
                  </button>
                </>
              )}

              {step === "confirm" && (
                <>
                  <button className="btn btn-secondary" onClick={onBack}>
                    취소
                  </button>
                  <button className="btn btn-success" onClick={onComplete}>
                    나눔 완료
                  </button>
                </>
              )}

              {step === "result" && (
                <>
                  <button className="btn btn-light" onClick={onClose}>
                    닫기
                  </button>
                  <button className="btn btn-success" onClick={onGoReview}
>
                    후기 작성하러 가기
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompleteSharingModal;
