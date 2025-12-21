import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReadCommunityLayout from "@/community/layouts/ReadCommunityLayout";
import {
  getQuestionDetail,
  getQuestionAnswers,
  addQuestionAnswer,
  updateQuestionAnswer,
  deleteQuestionAnswer,
} from "@/community/question/services/readQuestionApi";
import { QuestionDetailResponse, QuestionAnswerResponse } from "@/community/question/types/readQuestion";
import QuestionBtnAction from "@/community/question/components/QuestionBtnAction";
import { useAuthStore } from "@/global/stores/useAuthStore";
import Comments from "@/community/components/Comments";

function ReadQuestion() {
  const { questionId } = useParams<{ questionId: string }>();
  const numericQuestionId = Number(questionId);
  const loginUser = useAuthStore((s) => s.user);

  const [data, setData] = useState<QuestionDetailResponse | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  const commentItems = answers.map((a) => ({
    commentId: a.answerId,    
    writerId: a.writerId,
    nickname: a.nickname,
    content: a.content,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    }));

  useEffect(() => {
    if (!numericQuestionId) return;

    (async () => {
      try {
        const res = await getQuestionDetail(numericQuestionId);
        setData(res);
        const answerRes = await getQuestionAnswers(numericQuestionId);
        setAnswers(answerRes);
      } finally {
        setLoading(false);
      }
    })();
  }, [numericQuestionId]);

  const reloadAnswers = async () => {
    const res = await getQuestionAnswers(numericQuestionId);
    setAnswers(res);
  };

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
        <div className="d-flex align-items-center">
          <div className="me-3">
            {/* <ProfileImage memberId={data.memberId} size={48} /> */}
          </div>
          <strong>{data.nickname}</strong>
        </div>
      }

      actions={<QuestionBtnAction data={data} />}

      comments={
        <Comments
          targetId={numericQuestionId}
          comments={commentItems}
          reload={reloadAnswers}
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
