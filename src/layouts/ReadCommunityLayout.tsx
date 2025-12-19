import { ReactNode } from "react";
import { timeAgo } from "@/global/utils/date";
import ImageCarousel from "@/global/components/ImageCarousel";

interface Props {
  pageTitle: string;
  title: string;
  createdAt: string;
  images: { fileUrl: string }[];
  content: string;
  metaInfo?: ReactNode;
  authorProfile?: ReactNode;
  scoreInfo?: ReactNode;
  actions?: ReactNode;
  comments?: ReactNode;
  loginMemberId?: number;
}

function CommunityDetailLayout({
  pageTitle,
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
        <h5 className="fw-bold mb-3">{pageTitle}글 상세</h5>
        <hr />

        <div className="card">
          <div className="card-body">

            <div className="row g-3">
              <div className="col-md-4">
               <ImageCarousel images={images} />
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
                    <br />
                    {authorProfile}
                  </div>

                  <div className="col-2 text-start">
                    <br />
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
