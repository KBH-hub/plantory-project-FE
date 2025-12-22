import { axiosInstance } from "@/global/services/jjwt/axiosInstance";
import type { FetchMembersParams, MemberRow } from "../types/memberManagementType";

const apiBase = "/api/memberManagement/members";

export async function fetchMembers(params: FetchMembersParams) {
  const res = await axiosInstance.get<MemberRow[]>(apiBase, { params });
  const list = Array.isArray(res.data) ? res.data : [];
  const totalCount = list[0]?.totalCount ?? 0;
  return { list, totalCount };
}
