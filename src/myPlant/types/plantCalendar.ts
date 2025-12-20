import type {
    DiaryDetailResponse,
    DiaryListItem,
    MyPlantItem,
    WateringItem,
} from "@/myPlant/services/myPlantServices";
import type { ModalState } from "@/myPlant/enum/plantCalendarEnums";

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
