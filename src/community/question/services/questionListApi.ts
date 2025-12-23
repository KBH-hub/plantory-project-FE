import { axiosInstance } from "@/global/services/jjwt/axiosInstance"
import type { QuestionListPageResponse } from "@/community/question/types/questionList"

export const getQuestionList = async ( page: number, size: number, keyword?: string): Promise<QuestionListPageResponse> => {
  const res = await axiosInstance.get<QuestionListPageResponse>("/api/questions", {
    params: { page, size, keyword },
  });
  return res.data;
};