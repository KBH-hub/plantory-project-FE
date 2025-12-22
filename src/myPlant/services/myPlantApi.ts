import { axiosInstance } from "@/global/services/jjwt/axiosInstance";

import type {
  DiaryDetailResponse,
  DiaryListItem,
  MyPlantItem,
  WateringItem,
  CalendarRangeRequest,
  RegisterDiaryPayload
} from "@/myPlant/types/plantCalendarType";

export const getDiaryList = async (params: CalendarRangeRequest): Promise<DiaryListItem[]> => {
  const res = await axiosInstance.get("/api/plantingCalender/diary", { params });
  return res.data;
};

export const getWateringList = async (params: CalendarRangeRequest): Promise<WateringItem[]> => {
  const res = await axiosInstance.get("/api/plantingCalender/watering", { params });
  return res.data;
};

export const getMyPlantList = async (): Promise<MyPlantItem[]> => {
  const res = await axiosInstance.get("/api/plantingCalender/diary/myplant");
  return res.data;
};

export const getDiaryDetail = async (diaryId: number): Promise<DiaryDetailResponse> => {
  const res = await axiosInstance.get(`/api/plantingCalender/diaryInfo/${encodeURIComponent(String(diaryId))}`);
  return res.data;
};

export const deleteDiary = async (diaryId: number): Promise<void> => {
  await axiosInstance.delete(`/api/plantingCalender/diary/${encodeURIComponent(String(diaryId))}`);
};

export const updateWateringCheck = async (wateringId: number): Promise<{ message: string }> => {
  const res = await axiosInstance.put("/api/plantingCalender/watering", null, {
    params: { wateringId },
  });
  return res.data;
};

export const registerDiary = async (payload: RegisterDiaryPayload): Promise<{ message: string }> => {
  const fd = new FormData();
  fd.append("myplantId", String(payload.myplantId));
  fd.append("activity", payload.activity);
  fd.append("state", payload.state);
  fd.append("memo", payload.memo);

  (payload.files ?? []).forEach((f) => fd.append("files", f));

  const res = await axiosInstance.post("/api/plantingCalender/diary", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
