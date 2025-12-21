export interface QuestionListResponse {
  questionId: number;
  title: string;
  nickname: string;
  createdAt: string;
  updatedAt?: string;
  answerCount: number;
  imageUrl?: string;
  memberId: number;
}

export interface QuestionListPageResponse {
  list: QuestionListResponse[];
  totalCount: number;
  page: number;
  size: number;
}