import { useEffect, useState, useCallback } from "react";
import { getQuestionAnswers } from "@/community/question/services/readQuestionApi";
import { QuestionAnswerResponse } from "@/community/question/types/readQuestion";

export interface QuestionComment {
  commentId: number;
  writerId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
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