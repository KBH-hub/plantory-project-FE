export type MemberRow = {
  memberId: number;
  membername: string;
  nickname: string | null;
  phone: string | null;
  address: string | null;
  skillRate: number | null;
  managementRate: number | null;
  sharingRate: number | null;
  stopDay: string | null;
  createdAt: string | null;
  totalCount?: number;
};

export type FetchMembersParams = {
  keyword: string;
  offset: number;
  limit: number;
};
