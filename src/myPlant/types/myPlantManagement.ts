export type ApiMessage = { message: string };

export type MyPlantListRequest = {
  name: string;
  limit: number;
  offset: number;
};

export type MyPlantListItem = {
  myplantId: number;
  name: string;
  type?: string | null;
  soil?: string | null;
  temperature?: string | null;
  imageUrl?: string | null;
  imageId?: number | null;
  createdAt?: string | null;
  startAt?: string | null;
  endDate?: string | null;
  interval?: number | null;
  totalCount?: number | null;
};

export type CreateMyPlantPayload = {
  name: string;
  type: string;
  soil: string;
  temperature: string;
  startAt: string;
  endDate: string;
  interval: number;
};

export type UpdateMyPlantPayload = {
  myplantId: number;
  name: string;
  type: string;
  soil: string;
  temperature: string;
  startAt: string;
  endDate: string;
  interval: number;
};

export type PlantVm = {
    id: number;
    name: string;
    type: string;
    soil: string;
    temperature: string;
    img: string;
    fileId: number | null;
    createdAt: string | null;
    startAt: string | null;
    endDate: string | null;
    interval: number;
    daysSinceCreated: number;
    daysSinceLastWater: number;
    nextWaterAt: string | null;
    totalCount?: number;
};

export type PlantForm = {
    name: string;
    type: string;
    fertilizer: string;
    temp: string;
    startAt: string;
    intervalDays: string;
    endDate: string;
};

export type WateringForm = Pick<PlantForm, "startAt" | "intervalDays" | "endDate">;

export type ManagementHeaderProps = {
    keyword: string;
    onKeywordChange: (v: string) => void;
    onSearch: () => void;
    onOpenAdd: () => void;
};

export type PlantCardProps = {
    plant: PlantVm;
    onClick: () => void;
};

export type PlantGridProps = {
    loading: boolean;
    items: PlantVm[];
    onOpenDetail: (p: PlantVm) => void;
};

export type ManagementPaginationProps = {
    totalCount: number;
    pagerRef: React.RefObject<HTMLUListElement | null>;
};

export type PhotoPickerProps = {
    title: string;
    preview: string;
    inputWidth?: number;
    inputMaxWidth?: number;
    onChangeFile: (f: File | null) => void;
    rightSlot?: React.ReactNode;
};

export type WateringFieldsProps = {
    form: WateringForm;
    onChange: (next: WateringForm) => void;
};

export type AddPlantModalProps = {
    open: boolean;
    onClose: () => void;
    form: PlantForm;
    preview: string;
    onChangeForm: React.Dispatch<React.SetStateAction<PlantForm>>;
    onChangeFile: (f: File | null) => void;
    onSubmit: () => void;
};

export type DetailPlantModalProps = {
    open: boolean;
    onClose: () => void;
    currentVM: PlantVm | null;
    deletePhoto: boolean;
    preview: string;
    file: File | null;
    form: PlantForm;
    hasWatering: boolean;
    deletingWatering: boolean;
    onChangeForm: React.Dispatch<React.SetStateAction<PlantForm>>;
    onChangeFile: (f: File | null) => void;
    onClickPhotoDelete: () => void;
    onSubmitEdit: () => void;
    onDeletePlant: () => void;
    onDeleteWatering: () => void;
};

export type UseMyPlantListParams = {
    keyword: string;
    limit: number;
    pagerRef: React.RefObject<HTMLUListElement | null>;
};

export type UseAddPlantParams = {
    onRefresh: () => Promise<void> | void;
};

export type UseDetailPlantParams = {
    onRefresh: () => Promise<void> | void;
};