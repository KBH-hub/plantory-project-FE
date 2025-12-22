import { Link, useParams } from "react-router-dom";
import ReadCommunityLayout from "@/community/layouts/ReadCommunityLayout";
import { addQuestionAnswer, updateQuestionAnswer, deleteQuestionAnswer } from "@/community/question/services/readQuestionApi";
import QuestionBtnAction from "@/community/question/components/QuestionBtnAction";
import { useAuthStore } from "@/global/stores/useAuthStore";
import Comments from "@/community/components/Comments";
import ProfileImage from "@/global/components/ProfileImage";
import { useQuestionComments, useQuestionDetail } from "../hooks/useReadQuestion";

function ReadQuestion() {
  const { questionId } = useParams<{ questionId: string }>();
  const numericQuestionId = Number(questionId);
  const loginUser = useAuthStore((s) => s.user);

  const { data, loading, authorProfileImage } = useQuestionDetail(numericQuestionId);

  const { comments, reload } = useQuestionComments(numericQuestionId);

  if (loading || !data) return <div>로딩중...</div>;

  return (
    <ReadCommunityLayout
      pageTitle="질문"
      title={data.title}
      createdAt={data.createdAt}
      updatedAt={data.updatedAt}
      images={data.images}
      content={data.content}
      loginMemberId={loginUser?.memberId}

      authorProfile={
        <Link to={`/publicProfile/${data.memberId}`} className="text-decoration-none text-dark">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <ProfileImage src={authorProfileImage} size={48} disabled />
            </div>
            <strong>{data.nickname}</strong>
          </div>
        </Link>
      }
      actions={<QuestionBtnAction data={data} />}

      comments={
        <Comments
          targetId={numericQuestionId}
          comments={comments}
          reload={reload}
          loginMemberId={loginUser?.memberId}
          loginNickname={loginUser?.nickname}
          onAdd={addQuestionAnswer}
          onUpdate={updateQuestionAnswer}
          onDelete={deleteQuestionAnswer}
        />
      }
    />
  );
}

export default ReadQuestion;