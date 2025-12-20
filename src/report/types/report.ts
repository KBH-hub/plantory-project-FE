export interface reportMembers {
  memberId: number;
  nickname: string;
};

export interface ReportRequest {
  reportId: number;
  adminId: number;
  targetMemberId: number;
  content: string;
  status?: string;
  createdAt?: string;
  adminMemo?: string;
  delFlag?: string;
}
