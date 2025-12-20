import { axiosInstance } from "@/global/services/api/axiosInstance";

import type {
  ApiMessage,
  CreateMyPlantPayload,
  MyPlantListItem,
  MyPlantListRequest,
  UpdateMyPlantPayload,
} from "@/myPlant/types/myPlantManagement";

export const getMyPlantList = async (params: MyPlantListRequest): Promise<MyPlantListItem[]> => {
  const res = await axiosInstance.get("/api/myPlant/list", { params });
  return res.data;
};

export const createMyPlant = async (payload: CreateMyPlantPayload, file?: File): Promise<ApiMessage> => {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("type", payload.type);
  fd.append("soil", payload.soil);
  fd.append("temperature", payload.temperature);
  fd.append("startAt", payload.startAt);
  fd.append("endDate", payload.endDate);
  fd.append("interval", String(payload.interval));

  if (file) fd.append("file", file, file.name);

  const res = await axiosInstance.post("/api/myPlant", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateMyPlant = async (
  payload: UpdateMyPlantPayload,
  opts?: { delFile?: number; file?: File }
): Promise<ApiMessage> => {
  const fd = new FormData();
  fd.append("myplantId", String(payload.myplantId));
  fd.append("name", payload.name);
  fd.append("type", payload.type);
  fd.append("soil", payload.soil);
  fd.append("temperature", payload.temperature);
  fd.append("startAt", payload.startAt);
  fd.append("endDate", payload.endDate);
  fd.append("interval", String(payload.interval));

  if (opts?.file) fd.append("file", opts.file, opts.file.name);
  if (opts?.delFile != null) fd.append("delFile", String(opts.delFile));

  const res = await axiosInstance.put("/api/myPlant", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteMyPlant = async (params: { myplantId: number; delFile?: number }): Promise<ApiMessage> => {
  const res = await axiosInstance.delete("/api/myPlant", { params });
  return res.data;
};

export const deleteWatering = async (params: { myplantId: number }): Promise<ApiMessage> => {
  const res = await axiosInstance.delete("/api/plantingCalender/watering", { params });
  return res.data;
};
