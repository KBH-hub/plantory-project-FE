import { useParams } from "react-router-dom";
import CommunityDetailLayout from "@/layouts/ReadCommunityLayout";
import { useSharingComments, useSharingDetail } from "../hooks/useReadSharing";
import SharingActions from "../components/SharingActions";
import Comments from "@/global/components/Comments";

function ReadSharing() {
  const { sharingId } = useParams<{ sharingId: string }>();
  const { data, loading } = useSharingDetail(Number(sharingId));
  const { comments, loading: commentsLoading } = useSharingComments(Number(sharingId));

  if (loading || !data) return <div>로딩중...</div>;

  return (
    <CommunityDetailLayout
      title={data.title}
      createdAt={data.createdAt}
      images={data.images}
      content={data.content}

      metaInfo={
        <>
          식물 종류: <span className="text-dark">{data.plantType}</span>
          <span className="mx-2">|</span>
          관리난이도: <span className="text-dark">{data.managementLevelLabel}</span>
          <span className="mx-2">|</span>
          관리요구도: <span className="text-dark">{data.managementNeedsLabel}</span>
        </>
      }

      authorProfile={
        <div className="d-flex align-items-center">
          <div className="me-3">
            {/* 프로필 이미지 컴포넌트 */}
            <div
              className="bg-secondary rounded-circle"
              style={{ width: 48, height: 48 }}
            />
          </div>
          <strong>{data.nickname}</strong>
        </div>
      }

      scoreInfo={
        <small className="text-success fw-bold">
          🌿 나눔 지수 {data.sharingRate}ph
        </small>
      }

      actions={<SharingActions data={data} />}

      comments={
        <Comments comments={comments} loading={commentsLoading} />
      }
    />
  );
}

export default ReadSharing;
