import { Link } from "react-router-dom";
import { timeAgo } from "@/global/utils/date";
import { SharingCardListResponse } from "@/domain/community/sharing/types/sharingList";

type SharingCardProps = { item: SharingCardListResponse; variant?: "default" | "recommended"; };

function SharingCard({ item, variant = "default" }: SharingCardProps) {
  const isEdited = item.updatedAt && item.updatedAt !== item.createdAt;

  const displayTime =
    isEdited && item.updatedAt ? item.updatedAt: item.createdAt;

  const isDone = item.status === "true";
  const isRecommended = variant === "recommended";

  return (
    <div className={ isRecommended ? "flex-shrink-0" : "col-12 col-sm-6 col-md-4"}
      style={isRecommended ? { width: 320 } : undefined}
    >
      <Link
        to={`/readSharing/${item.sharingId}`}
        className="card text-reset text-decoration-none h-100"
      >
        <img
          src={item.fileUrl}
          className="card-img-top"
          style={{
            height: isRecommended ? 355 : 350,
            objectFit: "cover",
          }} alt={item.title}
        />

        <div className="card-body p-3">
          <span className={`badge ${isDone ? "bg-secondary" : "bg-success"}`}>
            {isDone ? "나눔완료" : "나눔 중"}
          </span>

          <div className="mt-1 text-truncate">
            {item.title}
          </div>

          <div className="d-flex justify-content-between small text-muted mt-1">
            <span>
              {timeAgo(displayTime)}
              {isEdited && " (수정됨)"}
            </span>

            <span>
              <i className="bi bi-chat" /> {item.commentCount}
              <i className="bi bi-heart ms-2" />{" "}
              {item.interestNum}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default SharingCard;