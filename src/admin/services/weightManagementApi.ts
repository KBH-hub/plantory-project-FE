import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import type {
  CareCountsResponse,
  RateConfig,
  WeightListItemApi,
  WeightListQuery,
  WeightListResult,
  WeightWeightsLatest,
  WeightWeightsSaveRequest,
} from "@/admin/types/weightManagementType";

const BASE = "/api/weightManagement";

export function normalizeList(items: WeightListItemApi[]): WeightListResult {
  return {
    items,
    total: items?.[0]?.totalCount ?? 0,
  };
}

export async function getWeightList(params: WeightListQuery): Promise<WeightListResult> {
  const res = await axiosInstance.get<WeightListItemApi[]>(`${BASE}/list`, {
    params: {
      keyword: params.keyword ?? "",
      range: params.range,
      offset: params.offset,
      limit: params.limit,
    },
  });

  return normalizeList(res.data ?? []);
}

export async function getLatestWeights(): Promise<WeightWeightsLatest | null> {
  const res = await axiosInstance.get<WeightWeightsLatest>(`${BASE}/latest`);
  return res.data ?? null;
}

export async function saveWeights(payload: WeightWeightsSaveRequest): Promise<void> {
  await axiosInstance.post(`${BASE}/list`, payload);
}

export async function getCareCounts(): Promise<CareCountsResponse> {
  const res = await axiosInstance.get<CareCountsResponse>(`${BASE}/careCounts`);
  return res.data ?? {};
}

export async function getRateConfig(): Promise<RateConfig | null> {
  const res = await axiosInstance.get<RateConfig>(`${BASE}/rate`);
  return res.data ?? null;
}

export async function saveRateConfig(payload: RateConfig): Promise<void> {
  await axiosInstance.post(`${BASE}/rate`, payload);
}
