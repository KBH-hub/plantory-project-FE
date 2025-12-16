import { Link } from "react-router-dom";
import { timeAgo } from "../utils/date";

type RecommendedItem = {
  sharingId: number;
  title: string;
  status: string;
  createdAt: string;
  interestNum: number;
  commentCount: number;
  fileUrl: string;
};

export default function RecommendedList({
  items,
}: {
  items: RecommendedItem[];
}) {
  return (
    <div className="d-flex flex-nowrap gap-3">
      {items.map((item) => {
        const isDone = item.status === "true";

        return (
          <Link
            key={item.sharingId}
            to={`/readSharing/${item.sharingId}`}
            className="text-decoration-none text-reset"
            style={{ width: 350 }}
          >
            <div className="card shadow-sm h-100">
              <img
                src={item.fileUrl}
                className="w-100"
                style={{ height: 375, objectFit: "cover" }}
                alt={item.title}
              />

              <div className="card-body p-3">
                <div className="fw-semibold text-truncate">
                  {item.title}
                </div>

                <div className="mt-1">
                  {isDone ? (
                    <span className="badge bg-secondary small">나눔완료</span>
                  ) : (
                    <span className="badge bg-success small">나눔 중</span>
                  )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <small className="text-muted">
                    {timeAgo(item.createdAt)}
                  </small>
                  <small className="text-muted">
                    <i className="bi bi-chat me-1"></i>
                    {item.commentCount}
                    <i className="bi bi-heart ms-3 me-1"></i>
                    {item.interestNum}
                  </small>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
