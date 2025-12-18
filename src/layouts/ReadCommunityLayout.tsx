import { ReactNode } from "react";
import { timeAgo } from "@/global/utils/date";

interface Props {
  title: string;
  createdAt: string;
  images: { fileUrl: string }[];
  content: string;
  metaInfo?: ReactNode;
  authorProfile?: ReactNode;
  scoreInfo?: ReactNode;
  actions?: ReactNode;
  comments?: ReactNode;
}

function CommunityDetailLayout({
  title,
  createdAt,
  images,
  content,
  metaInfo,
  authorProfile,
  scoreInfo,
  actions,
  comments,
}: Props) {
  return (
    <div className="bg-light">
      <div className="mx-auto" style={{ width: 1470, padding: 16 }}>
        <h5 className="fw-bold mb-3">게시글 상세</h5>
        <hr />

        <div className="card">
          <div className="card-body">

            <div className="row g-3">
              <div className="col-md-4">
                {images.length === 0 ? (
                  <div className="text-muted text-center py-5">
                    등록된 이미지가 없습니다.
                  </div>
                ) : (
                  <div
                    id="communityCarousel"
                    className="carousel slide"
                    data-bs-ride="false"
                  >
                    <div className="carousel-inner">
                      {images.map((img, idx) => (
                        <div
                          key={idx}
                          className={`carousel-item ${idx === 0 ? "active" : ""}`}
                        >
                          <img
                            src={img.fileUrl}
                            className="d-block w-100 object-fit-cover"
                            style={{ height: 450 }}
                          />
                        </div>
                      ))}
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          className="carousel-control-prev"
                          type="button"
                          data-bs-target="#communityCarousel"
                          data-bs-slide="prev"
                        >
                          <span className="carousel-control-prev-icon" />
                        </button>

                        <button
                          className="carousel-control-next"
                          type="button"
                          data-bs-target="#communityCarousel"
                          data-bs-slide="next"
                        >
                          <span className="carousel-control-next-icon" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="col-md-7">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-1">{title}</h5>
                  <div className="text-muted small">{timeAgo(createdAt)}</div>
                </div>


                {metaInfo && (
                  <>
                    <hr />
                    <div className="text-muted small mb-2">
                      {metaInfo}
                    </div>
                  </>
                )}

                <div
                  className="bg-white p-2"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>

            {(authorProfile || scoreInfo || actions) && (
              <>
                <div className="row align-items-center">

                  <div className="col-3">
                    {authorProfile}
                  </div>

                  <div className="col-2 text-start">
                    {scoreInfo}
                  </div>

                  <div className="col-7 d-flex justify-content-end gap-2">
                    {actions}
                  </div>

                </div>
              </>
            )}

            <hr />
            {comments}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CommunityDetailLayout;
