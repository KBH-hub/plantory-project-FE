import { useState } from "react";
import { formatDate } from "../../../global/utils/date";
import { SharingCommentResponse } from "@/domain/community/sharing/types/readSharing";
import { addSharingComments, updateSharingComments, deleteSharingComments } from "@/domain/community/sharing/services/readSharingApi";
import { showModal } from "../../../global/utils/showModal";

interface Props {
  sharingId: number;
  comments: SharingCommentResponse[];
  reload: () => Promise<void>;
  loginNickname?: string;
  loginMemberId?: number;
}

function Comments({ sharingId, comments, reload, loginNickname, loginMemberId }: Props) {
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  
  const handleSubmit = async () => {
    if (!content.trim()) {
      showModal.alert("댓글을 입력하세요.");
      return;
    }

    try {
      await addSharingComments(sharingId, content);

      showModal.alert("댓글이 등록되었습니다.", {
        callback: async () => {
          setContent("");
          await reload();   
        },
      });

    } catch (e) {
      showModal.alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };
 const handleDelete = async (commentId: number) => {
    const ok = await showModal.confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    await deleteSharingComments(sharingId,commentId);
    showModal.alert("삭제되었습니다.") 
    await reload();
  };

  const handleUpdate = async (commentId: number) => {
    if (!editingContent.trim()) {
      showModal.alert("댓글 내용을 입력하세요.");
      return;
    }

    await updateSharingComments(sharingId, commentId, editingContent);
    setEditingId(null);
    setEditingContent("");
    await reload();
  };

  return (
    <>
      <div className="mb-2 text-muted small">댓글</div>

      <ul className="list-group mt-3">
        {comments.map((c) => {
          console.log("writerId:", c.writerId, "loginMemberId:", loginMemberId);

          const isMine = c.writerId === loginMemberId;

          return (
            <li key={c.commentId} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold small">{c.nickname}</span>
                <span className="text-muted small">
                  {c.updatedAt ? `${formatDate(c.updatedAt)} (수정됨)` : formatDate(c.createdAt)}
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
                        <button
                          className="btn btn-sm btn-link p-0 text-primary"
                          onClick={() => handleUpdate(c.commentId)}
                        >
                          저장
                        </button>
                        <button
                          className="btn btn-sm btn-link p-0 text-muted"
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
                        <button
                          className="btn btn-sm btn-link p-0 text-muted"
                          onClick={() => {
                            setEditingId(c.commentId);
                            setEditingContent(c.content);
                          }}
                        >
                          수정
                        </button>
                        <button
                          className="btn btn-sm btn-link p-0 text-muted"
                          onClick={() => handleDelete(c.commentId)}
                        >
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
        <div className="me-3 d-flex align-items-center" style={{ whiteSpace: "nowrap" }}>
          <span className="ms-2 fw-semibold small">
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
          <button className="btn btn-secondary" onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
    </>
  );
}

export default Comments;