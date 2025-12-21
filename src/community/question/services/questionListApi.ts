import { axiosInstance } from "@/global/services/api/axiosInstance"
import type { QuestionListPageResponse } from "@/community/question/tyeps/questionList"

export const getQuestionList = async ( page: number, size: number, keyword?: string): Promise<QuestionListResponse> => {
  const res = await axiosInstance.get<QuestionListPageResponse>("/api/questions", {
    params: { page, size, keyword },
  });
  return res.data;
};