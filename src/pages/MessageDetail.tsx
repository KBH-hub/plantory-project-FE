import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMessageDetail /*, sendMessage */ } from "@/services/messageService";
import {MessageDetailResponse, ReplyForm} from "@/types/message/message"

export default function MessageDetail() {
  const { messageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<MessageDetailResponse | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reply, setReply] = useState<ReplyForm>({
    to: "(삭제된 쪽지)",
    post: "삭제된 쪽지입니다.",
    title: "(삭제된 쪽지)",
    content: "",
  });

  const safeId = useMemo(() => {
    const id = Number(messageId);
    return Number.isFinite(id) && id > 0 ? id : null;
  }, [messageId]);

  useEffect(() => {
    if (!safeId) {
      setLoading(false);
      setDetail(null);
      return;
    }

    let alive = true;
    setLoading(true);

    getMessageDetail(safeId)
      .then((res) => {
        if (!alive) return;
        setDetail(res ?? null);
      })
      .catch((e) => {
        if (!alive) return;
        console.error(e);
        setDetail(null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [safeId]);

  const formatDateTime = (iso?: string) => {
    if (!iso) return "";
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

  const openReplyModal = () => {
    const to = detail?.senderNickname || "(삭제된 쪽지)";
    const post = detail?.targetTitle || "삭제된 쪽지입니다.";
    const title = detail?.title ? `RE: ${detail.title}` : "(삭제된 쪽지)";

    setReply({
      to,
      post,
      title,
      content: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: 실제 전송 API에 맞게 구현
    // await sendMessage({
    //   toNickname: reply.to,
    //   title: reply.title,
    //   content: reply.content,
    //   targetTitle: reply.post,
    //   // receiverId: detail?.senderId, ... 등 백엔드 스펙에 맞게
    // });

    closeModal();
  };

  if (loading) return <div className="container-xxl py-4">로딩중...</div>;
  if (!detail) return <div className="container-xxl py-4">쪽지를 찾을 수 없습니다.</div>;

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
              <button type="button" className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
                닫기
              </button>

              <button type="button" className="btn btn-success px-4" onClick={openReplyModal}>
                답장하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 답장 모달 (React state 기반) */}
      {isModalOpen && (
        <>
          <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <form className="modal-content" onSubmit={onSubmitReply}>
                <div className="modal-header">
                  <h5 className="modal-title">쪽지 보내기</h5>
                  <button type="button" className="btn-close" aria-label="닫기" onClick={closeModal} />
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
                      onChange={(e) => setReply((p) => ({ ...p, title: e.target.value }))}
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
                      onChange={(e) => setReply((p) => ({ ...p, content: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                    취소
                  </button>
                  <button type="submit" className="btn btn-success">
                    쪽지 보내기
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* backdrop */}
          <div className="modal-backdrop fade show" onClick={closeModal} />
        </>
      )}
    </div>
  );
}
