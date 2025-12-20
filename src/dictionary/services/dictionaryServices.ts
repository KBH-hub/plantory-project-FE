import { axiosInstance } from "@/global/services/api/axiosInstance";
import type { GardenApiResponse, GardenDictionaryResponse, GardenDetailItem, GardenFileItem, DryApiResponse, DryDetailItem, DryDetailResponse } from "@/dictionary/types/dictionary";


function asArray<T>(v: T | T[] | null | undefined): T[] {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}

export async function getGardenDictionaryPage(params: {
  pageNo: number;
  numOfRows: number;
  signal?: AbortSignal;
}): Promise<GardenApiResponse> {
  const res = await axiosInstance.get("/api/dictionary/garden", {
    params: { pageNo: String(params.pageNo), numOfRows: String(params.numOfRows) },
    signal: params.signal,
  });
  return res.data;
}

export async function getGardenDictionaryDetail(cntntsNo: string | number) {
  const res = await axiosInstance.get<GardenDictionaryResponse>(
    `/api/dictionary/garden/${cntntsNo}`
  );

  const data = res.data;
  const files: GardenFileItem[] = asArray(data?.files?.body?.items?.item);
  const detail: GardenDetailItem | null = data?.detail?.body?.item ?? null;

  return { files, detail };
}

export async function getDryDictionaryPage(params: {
  pageNo: number;
  numOfRows: number;
  sClCode?: string;
  signal?: AbortSignal;
}): Promise<DryApiResponse> {
  const res = await axiosInstance.get<DryApiResponse>("/api/dictionary/dry", {
    params: {
      pageNo: String(params.pageNo),
      numOfRows: String(params.numOfRows),
      ...(params.sClCode ? { sClCode: String(params.sClCode) } : {}),
    },
    signal: params.signal,
  });

  return res.data;
}

export async function getDryDictionaryDetail(cntntsNo: string | number) {
  const res = await axiosInstance.get<DryDetailResponse>(
    `/api/dictionary/dry/${cntntsNo}`
  );

  const item: DryDetailItem | null = res.data?.body?.item ?? null;
  return { detail: item };
}
