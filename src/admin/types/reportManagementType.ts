export type ReportStatusFilter = "" | "true" | "false";

export interface ReportListQuery {
  keyword?: string;
  status?: ReportStatusFilter;
  limit: number;
  offset: number;
}

export interface ReportListItem {
  reportId: number;
  targetMemberId?: string | null;
  reporterId?: string | null;
  adminId?: string | null;
  content: string;
  status: "true" | "false" | boolean;
  createdAt?: string | null;
}

export interface ReportListResponse {
  totalCount: number;
  list: ReportListItem[];
}

export interface ReportDetail {
  reportId: number;
  reporterName?: string | null;
  targetName?: string | null;
  reporterId?: string | null;
  targetMemberId?: string | null;
  content: string;
  createdAt?: string | null;
  adminMemo?: string | null;
}

export interface ReportImageItem {
  fileUrl?: string | null;
}

export type ReportTargetType = "REPORT";

export interface ReportImageQuery {
  targetType: ReportTargetType;
  targetId: number;
}

export interface ReportProcessRequest {
  targetMemberId: string;
  adminMemo: string;
  stopDays: number;
}

export interface SoftDeleteRequest {
  ids: number[];
}

export interface ReportListResult {
  items: ReportListItem[];
  total: number;
}
