import { axiosInstance } from "@/global/services/api/axiosInstance"
import type { QuestionDetailResponse, QuestionAnswerResponse } from "@/community/question/types/readQuestion"

export const getQuestionDetail = async ( questionId: number ): Promise<QuestionDetailResponse> => {
  return (await axiosInstance.get<QuestionDetailResponse>( `/api/questions/${questionId}` )).data;
};

export const deleteQuestion = async (questionId: number): Promise<void> => {
  await axiosInstance.delete(`/api/questions/${questionId}`);
};

export const getQuestionAnswers = async (questionId: number) => {
  return(await axiosInstance.get<QuestionAnswerResponse[]>( `/api/questions/${questionId}/answers`)).data;
};

export const addQuestionAnswer = async ( questionId: number, content: string ): Promise<boolean> => {
  return(await axiosInstance.post<boolean>(`/api/questions/${questionId}/answers`, { content })).data;
};

export const updateQuestionAnswer = async ( questionId: number, answerId: number, content: string ): Promise<boolean> => {
  const res = await axiosInstance.put<boolean>(
    `/api/questions/answers/${answerId}`,
    {
      questionId,
      content,
    }
  );
  return res.data;
};

export const deleteQuestionAnswer = async ( questionId: number, answerId: number ): Promise<boolean> => {
  const res = await axiosInstance.delete<boolean>(
    `/api/questions/answers/${answerId}`,
    {
      data: {
        questionId,
      },
    }
  );
  return res.data;
};