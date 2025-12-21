import { useState } from "react";
import { formatDate } from "@/global/utils/date";
import { showModal } from "@/global/utils/showModal";

export interface CommentItem {
  commentId: number;
  writerId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface Props {
  targetId: number;
  comments: CommentItem[];
  reload: () => Promise<void>;
  loginMemberId?: number;
  loginNickname?: string;

  onAdd: (targetId: number, content: string) => Promise<boolean>;
  onUpdate: (targetId: number, commentId: number, content: string) => Promise<boolean>;
  onDelete: (targetId: number, commentId: number) => Promise<boolean>;
}

function Comments({
  targetId,
  comments,
  reload,
  loginMemberId,
  loginNickname,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const handleAdd = async () => {
    if (!content.trim()) {
      showModal.alert("댓글을 입력하세요.");
      return;
    }

    const ok = await onAdd(targetId, content);
    if (!ok) {
      showModal.alert("댓글 등록에 실패했습니다.");
      return;
    }

    setContent("");
    await reload();
  };

  const handleUpdate = async (commentId: number) => {
    if (!editingContent.trim()) {
      showModal.alert("댓글 내용을 입력하세요.");
      return;
    }

    const ok = await onUpdate(targetId, commentId, editingContent);
    if (!ok) {
      showModal.alert("댓글 수정에 실패했습니다.");
      return;
    }

    setEditingId(null);
    setEditingContent("");
    await reload();
  };

  const handleDelete = async (commentId: number) => {
    const okConfirm = await showModal.confirm("댓글을 삭제하시겠습니까?");
    if (!okConfirm) return;

    const ok = await onDelete(targetId, commentId);
    if (!ok) {
      showModal.alert("댓글 삭제에 실패했습니다.");
      return;
    }

    await reload();
  };

  return (
    <>
      <div className="mb-2 text-muted small">댓글</div>

      <ul className="list-group mt-3">
        {comments.map((c) => {
          const isMine = c.writerId === loginMemberId;

          return (
            <li key={c.commentId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold small">{c.nickname}</span>
                <span className="text-muted small">
                  {c.updatedAt
                    ? `${formatDate(c.updatedAt)} (수정됨)`
                    : formatDate(c.createdAt)}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1 me-3">
                  {editingId === c.commentId ? (
                    <input
                      className="form-control form-control-sm"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                  ) : (
                    <div>{c.content}</div>
                  )}
                </div>

                {isMine && (
                  <div className="d-flex gap-2 flex-shrink-0">
                    {editingId === c.commentId ? (
                      <>
                        <button className="btn btn-sm btn-link p-0 text-primary" onClick={() => handleUpdate(c.commentId)}>
                          저장
                        </button>
                        <button className="btn btn-sm btn-link p-0 text-muted"
                          onClick={() => {
                            setEditingId(null);
                            setEditingContent("");
                          }}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm btn-link p-0 text-muted"
                          onClick={() => {
                            setEditingId(c.commentId);
                            setEditingContent(c.content);
                          }}
                        >
                          수정
                        </button>
                        <button className="btn btn-sm btn-link p-0 text-muted" onClick={() => handleDelete(c.commentId)}>
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="d-flex align-items-center mt-3">
        <div className="me-3" style={{ whiteSpace: "nowrap" }}>
          <span className="fw-semibold small">
            {loginNickname ?? "로그인 필요"}
          </span>
        </div>

        <div className="input-group">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            placeholder="댓글을 입력하세요."
          />
          <button className="btn btn-secondary" onClick={handleAdd}>
            등록
          </button>
        </div>
      </div>
    </>
  );
}

export default Comments;
