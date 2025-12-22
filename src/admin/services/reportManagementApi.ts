import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import type {
  ReportDetail,
  ReportImageItem,
  ReportImageQuery,
  ReportListQuery,
  ReportListResponse,
  ReportListResult,
  ReportProcessRequest,
  SoftDeleteRequest,
} from "@/admin/types/reportManagementType";

const BASE = "/api/reportManagement";

export function normalizeReportList(data: ReportListResponse | null | undefined): ReportListResult {
  return {
    items: data?.list ?? [],
    total: data?.totalCount ?? 0,
  };
}

export async function getReportList(params: ReportListQuery): Promise<ReportListResult> {
  const res = await axiosInstance.get<ReportListResponse>(`${BASE}/list`, {
    params: {
      keyword: params.keyword ?? "",
      status: params.status ?? "",
      limit: params.limit,
      offset: params.offset,
    },
  });

  return normalizeReportList(res.data);
}

export async function getReportDetail(reportId: number): Promise<ReportDetail> {
  const res = await axiosInstance.get<ReportDetail>(`${BASE}/detail/${reportId}`);
  return res.data;
}

export async function getReportImages(query: ReportImageQuery): Promise<ReportImageItem[]> {
  const res = await axiosInstance.get<ReportImageItem[]>(`${BASE}/images`, {
    params: {
      targetType: query.targetType,
      targetId: query.targetId,
    },
  });
  return res.data ?? [];
}

export async function submitReportProcess(reportId: number, payload: ReportProcessRequest): Promise<void> {
  await axiosInstance.post(`${BASE}/${reportId}`, payload);
}

export async function softDeleteReports(payload: SoftDeleteRequest): Promise<void> {
  await axiosInstance.put(`${BASE}/softDelete`, payload);
}
