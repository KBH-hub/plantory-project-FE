export type ISODateTime = string;

export interface MyPlantItem {
  myplantId: number;
  name: string;
}

export interface DiaryListItem {
  diaryId: number;
  name: string;
  activity: string;
  state: string;
  memo: string;
  createdAt: ISODateTime;
  photoUrls?: string[];
}

export interface WateringItem {
  wateringId: number;
  name: string;
  dateAt: ISODateTime;
  checkFlag: boolean;
}

export interface DiaryDetailResponse {
  diary: {
    diaryId: number;
    name: string;
    activity: string;
    state: string;
    memo: string;
    createdAt: ISODateTime;
  };
  images: { fileUrl: string }[];
}

export interface CalendarRangeRequest {
  startDate: ISODateTime;
  endDate: ISODateTime;
}

export interface RegisterDiaryPayload {
  myplantId: number;
  activity: string;
  state: string;
  memo: string;
  files?: File[];
}

import type { ModalState } from "@/myPlant/enums/plantCalendarEnums";

export type DiaryFormErrors = Partial<{
    myplantId: string;
    activity: string;
    state: string;
    memo: string;
}>;

export type CalendarCell =
    | { type: "EMPTY" }
    | { type: "DAY"; ymd: string; day: number };

export type PlantCalendarState = {
    currentYear: number;
    currentMonth: number;
    selectedYmd: string;

    diaries: DiaryListItem[];
    waters: WateringItem[];
    myPlants: MyPlantItem[];

    monthDiaryCount: Record<string, number>;
    monthWaterCount: Record<string, number>;

    modalState: ModalState;

    photoFiles: File[];
    imageDraftFile: File | null;
    imageDraftUrl: string;

    regMyplantId: number | "";
    regActivity: string;
    regState: string;
    regMemo: string;

    saving: boolean;
    detail: DiaryDetailResponse | null;
    errors: DiaryFormErrors;
};
