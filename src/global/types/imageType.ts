export interface ImageType {
  imageId: number;
  memberId: number;
  targetType: "SHARING" | "QUESTION" | string;
  targetId: number;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  delFlag: string | null;
}
