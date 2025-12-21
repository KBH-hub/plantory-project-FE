export interface QuestionDetailResponse {
  questionId: number;
  memberId: number;
  nickname: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  imageUrl?: string;
  images: {
    fileUrl: string;
  }[];
}

export interface QuestionAnswerResponse {
  answerId: number;
  writerId: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}
