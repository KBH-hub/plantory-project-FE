import { timeAgo } from "../utils/date";
import { SharingCommentResponse } from "@/domain/sharing/types/readSharing";

interface Props {
  comments: SharingCommentResponse[];
  loading?: boolean;
}

function Comments({ comments, loading }: Props) {
  if (loading) {
    return <div className="text-muted">댓글 로딩중...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-muted">댓글이 없습니다.</div>;
  }

  return (
    <ul className="list-group mt-3">
      {comments.map((c) => (
        <li key={c.commentId} className="list-group-item">
          <div className="d-flex justify-content-between">
            <strong>{c.nickname}</strong>
            <span className="text-muted small">
              {c.updatedAt
                ? `${timeAgo(c.updatedAt)} (수정됨)`
                : timeAgo(c.createdAt)}
            </span>
          </div>
          <div className="mt-1">{c.content}</div>
        </li>
      ))}
    </ul>
  );
}

export default Comments;
