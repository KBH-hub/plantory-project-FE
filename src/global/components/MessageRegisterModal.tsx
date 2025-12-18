import type { ReplyForm } from "@/domain/message/types/message";

type Props = {
  isOpen: boolean;
  reply: ReplyForm;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChangeTitle: (title: string) => void;
  onChangeContent: (content: string) => void;
};

export default function MessageRegisterModal({
  isOpen,
  reply,
  isSending,
  onClose,
  onSubmit,
  onChangeTitle,
  onChangeContent,
}: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={onSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">쪽지 보내기</h5>
              <button type="button" className="btn-close" aria-label="닫기" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small text-muted">받는 사람</label>
                <input type="text" className="form-control" value={reply.to} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label small text-muted">관련 글</label>
                <input type="text" className="form-control" value={reply.post} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label small">제목</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="제목을 입력하세요."
                  required
                  value={reply.title}
                  onChange={(e) => onChangeTitle(e.target.value)}
                  disabled={isSending}
                />
              </div>

              <div className="mb-0">
                <label className="form-label small">내용</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="쪽지를 입력하세요."
                  required
                  value={reply.content}
                  onChange={(e) => onChangeContent(e.target.value)}
                  disabled={isSending}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={isSending}>
                취소
              </button>
              <button type="submit" className="btn btn-success" disabled={isSending}>
                {isSending ? "전송중..." : "쪽지 보내기"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}
