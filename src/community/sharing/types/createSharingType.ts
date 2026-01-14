import { ManageLevel, ManageDemand } from "@/community/sharing/enum/manageTypes";

export interface CreateSharingForm {
  title: string;
  content: string;
  plantType: string;
  managementLevel?: ManageLevel;
  managementDemand?: ManageDemand;
}

export interface CreateSharingImage {
  imageId?: number;     
  file?: File;          
  previewUrl: string;
  status: "EXISTING" | "NEW";
}

export interface CreateSharingDeleteImage {
  deletedImageIds: number[];
}


export interface CreateSharingState {
  form: CreateSharingForm;
  images: CreateSharingImage[];
  deletedImageIds: number[];
}
