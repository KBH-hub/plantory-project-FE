import { useEffect, useState, useCallback } from "react";
import { getQuestionAnswers } from "@/community/question/services/readQuestionApi";
import { QuestionAnswerResponse, QuestionDetailResponse } from "@/community/question/types/readQuestion";
import { getQuestionDetail } from "@/community/question/services/readQuestionApi";
import { profileApi } from "@/profile/services/profileApi";


export interface QuestionComment {
  commentId: number;
  writerId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export function useQuestionDetail(questionId?: number) {
  const [data, setData] = useState<QuestionDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [authorProfileImage, setAuthorProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!questionId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getQuestionDetail(questionId);
        setData(res);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [questionId]);

  useEffect(() => {
    if (!data?.memberId) return;

    profileApi
      .getPicture(data.memberId)
      .then((res) => {
        setAuthorProfileImage(res?.imageUrl ?? null);
      })
      .catch(() => {
        setAuthorProfileImage(null);
      });
  }, [data?.memberId]);

  return {
    data,
    loading,
    error,
    authorProfileImage,
  };
}

export function useQuestionComments(questionId?: number) {
  const [comments, setComments] = useState<QuestionComment[]>([]);

  const reload = useCallback(async () => {
    if (!questionId) return;

    const res: QuestionAnswerResponse[] = await getQuestionAnswers(questionId);

    setComments(
      res.map((a) => ({
        commentId: a.answerId, 
        writerId: a.writerId,
        nickname: a.nickname,
        content: a.content,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      }))
    );
  }, [questionId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { comments, reload };
}