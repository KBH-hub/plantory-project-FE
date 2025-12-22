export interface RecommendedSharing {
  sharingId: number;
  title: string;
  status: string;
  createdAt: string;
  interestNum: number;
  commentCount: number;
  fileUrl: string;
}

export interface TodayWatering {
  name: string;
  interval: number;
}

export interface TodayDiary {
  diaryId: number;
  myplantId: number;
  myplantName: string;
  activity: string;
  state: string;
  memo: string;
  createdAt: string;
  fileUrl?: string; 
}

export interface DashboardResponse {
  myPlantsCount: number;
  todayWateringCount: number;
  careNeededCount: number;
  recommendeds: RecommendedSharing[];
  waterings: TodayWatering[];
  diaries: TodayDiary[];
}
