export type DateRange = "30D" | "60D" | "90D" | "ALL";

export interface WeightListQuery {
  keyword: string;
  range: DateRange;
  offset: number;
  limit: number;
}

export interface WeightListItemApi {
  memberId: string;
  membername: string;
  nickname: string;
  searchWeight: number;
  questionWeight: number;
  totalCount?: number;
}

export interface WeightListItemUI extends WeightListItemApi {
  plantsNeedingAttention: number;
}

export interface WeightListResult {
  items: WeightListItemApi[];
  total: number;
}

export type CareCountsResponse = Record<string, number>;

export interface WeightWeightsLatest {
  searchWeight: number;
  questionWeight: number;
}

export interface WeightWeightsSaveRequest {
  searchWeight: number;
  questionWeight: number;
}

export interface RateConfig {
  initialSkillRate: number;
  skillRateGrade1: number;
  skillRateGrade2: number;
  skillRateGrade3: number;
  skillRateGrade4: number;

  initialManagementRate: number;
  managementRateGrade1: number;
  managementRateGrade2: number;
  managementRateGrade3: number;
}
