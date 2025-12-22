import type { MessageDetailResponse } from "@/message/types/messageType";
import { formatDateTime } from "@/global/utils/formatDateTime";

type Props = {
  detail: MessageDetailResponse;
  onBack: () => void;
  onReply: () => void;
};

export default function MessageDetailView({ detail, onBack, onReply }: Props) {
  return (
    <div className="bg-light">
      <div className="container-xxl py-4">
        <h5 className="fw-bold mb-3">쪽지함</h5>

        <div className="card shadow-sm">
          <div className="card-body" style={{ height: 600 }}>
            <div className="row g-3 small">
              <div className="col-12 col-md-6 d-flex">
                <div className="text-muted me-3" style={{ width: 90 }}>
                  제목
                </div>
                <div className="flex-grow-1">{detail.title}</div>
              </div>

              <div className="col-12 col-md-6 d-flex">
                <div className="text-muted me-3" style={{ width: 90 }}>
                  보낸 사람
                </div>
                <div className="flex-grow-1">{detail.senderNickname}</div>
              </div>

              <div className="col-12 col-md-6 d-flex">
                <div className="text-muted me-3" style={{ width: 90 }}>
                  관련 글
                </div>
                <div className="flex-grow-1">{detail.targetTitle || "(삭제된 쪽지)"}</div>
              </div>

              <div className="col-12 col-md-6 d-flex">
                <div className="text-muted me-3" style={{ width: 90 }}>
                  받은 시간
                </div>
                <div className="flex-grow-1">{formatDateTime(detail.createdAt)}</div>
              </div>
            </div>

            <hr className="my-3" />

            <div className="mb-2 small text-muted">내용</div>
            <textarea
              className="form-control"
              rows={8}
              readOnly
              style={{ height: 370 }}
              value={detail.content ?? ""}
            />

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="button" className="btn btn-secondary px-4" onClick={onBack}>
                닫기
              </button>

              <button type="button" className="btn btn-success px-4" onClick={onReply}>
                답장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
