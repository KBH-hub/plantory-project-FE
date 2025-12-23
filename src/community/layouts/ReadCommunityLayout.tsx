import { ReactNode } from "react";
import { formatDate } from "@/global/utils/date";
import ImageCarousel from "@/community/components/ImageCarousel";

interface Props {
  pageTitle: string;
  title: string;
  createdAt: string;
  updatedAt?: string; 
  images: { fileUrl: string }[];
  content: string;
  metaInfo?: ReactNode;
  authorProfile?: ReactNode;
  scoreInfo?: ReactNode;
  actions?: ReactNode;
  comments?: ReactNode;
  loginMemberId?: number;
}

function ReadCommunityLayout({
  pageTitle,
  title,
  createdAt,
  updatedAt,
  images,
  content,
  metaInfo,
  authorProfile,
  scoreInfo,
  actions,
  comments,
}: Props) {
  const isEdited = updatedAt && updatedAt !== createdAt;
  const displayTime = isEdited ? updatedAt! : createdAt;

  return (
    <div className="bg-light">
      <div className="mx-auto" style={{ width: 1470, padding: 16 }}>
        <h5 className="fw-bold mb-3">{pageTitle}글 상세</h5>
        <hr />

        <div className="card">
          <div className="card-body">

            <div className="row g-3">
              <div className="col-md-4" >
               <ImageCarousel images={images} />
              </div>

              <div className="col-md-7">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="fw-bold mb-1">{title}</h5>
                  <div className="text-muted small">
                    {formatDate(displayTime)}
                    {isEdited && <span className="ms-1">(수정됨)</span>}
                  </div>
                </div>
                <hr />


                {metaInfo && (
                  <>
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

export default ReadCommunityLayout;
