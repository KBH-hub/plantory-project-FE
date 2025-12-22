import { useParams } from "react-router-dom";
import { useSharingComments, useSharingDetail } from "@/community/sharing/hooks/useReadSharing";
import SharingBtnAction from "@/community/sharing/components/SharingBtnAction";
import Comments from "@/community/components/Comments";
import { useAuthStore } from "@/global/stores/useAuthStore";
import ReadCommunityLayout from "@/community/layouts/ReadCommunityLayout";
import { addSharingComments, updateSharingComments, deleteSharingComments } from "../services/readSharingApi";

import "@/styles/readSharing.css"
import ProfileImage from "@/global/components/ProfileImage";

function ReadSharing() {
  const { sharingId } = useParams<{ sharingId: string }>();
  const { data, loading, authorProfileImage } = useSharingDetail(Number(sharingId));
  const { comments, reload } = useSharingComments(Number(sharingId));
  const loginUser = useAuthStore((s) => s.user);

  
  if (loading || !data) return <div>로딩중...</div>;

  return (
    <ReadCommunityLayout
      pageTitle="나눔"
      title={data.title}
      createdAt={data.createdAt}
      updatedAt={data.updatedAt}
      images={data.images}
      content={data.content}
      loginMemberId={loginUser?.memberId}

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
            <ProfileImage src={authorProfileImage} size={48} disabled />
            {/* <div  style={{ width: 48, height: 48 }} /> */}
          </div>
          <strong>{data.nickname}</strong>
        </div>
      }

      scoreInfo={
        <small className="text-success fw-bold">
          🌿 나눔 지수 {data.sharingRate}ph
        </small>
      }

      actions={<SharingBtnAction data={data} />}

      comments={
        <Comments
          targetId={Number(sharingId)}
          comments={comments}
          reload={reload}
          loginMemberId={loginUser?.memberId}
          loginNickname={loginUser?.nickname}
          onAdd={addSharingComments}
          onUpdate={updateSharingComments}
          onDelete={deleteSharingComments}
        />

      }
    />
  );
}

export default ReadSharing;
