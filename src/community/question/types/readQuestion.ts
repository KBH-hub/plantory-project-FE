export interface QuestionDetailResponse {
  questionId: number;
  memberId: number;
  nickname: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  images: {
    imageId: number;
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
