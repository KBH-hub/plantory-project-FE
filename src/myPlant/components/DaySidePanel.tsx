import React from "react";
import type { DiaryListItem, WateringItem } from "@/myPlant/services/myPlantServices";
import WateringCard from "@/myPlant/components/WateringCard";
import DiaryListCard from "@/myPlant/components/DiaryListCard";

type Props = {
    selectedYmd: string;
    waters: WateringItem[];
    diaries: DiaryListItem[];
    isToday: boolean;
    onToggleWatering: (wateringId: number) => void;
    onOpenReg: (ymd: string) => void;
    onClickDiary: (diaryId: number) => void;
    onDeleteDiary: (diaryId: number) => void;
};

export default function DaySidePanel({
    selectedYmd,
    waters,
    diaries,
    isToday,
    onToggleWatering,
    onOpenReg,
    onClickDiary,
    onDeleteDiary,
}: Props) {
    return (
        <div className="bg-white rounded">
            <div className="bg-dark d-flex align-items-center py-1">
                <h5 className="m-0 ms-3 fw-bold text-white">{selectedYmd} 식물 관리</h5>
            </div>

            <div className="p-3 border border-2 rounded" style={{ height: 695, overflowY: "auto" }}>
                <WateringCard waters={waters} isToday={isToday} onToggle={onToggleWatering} />

                <div className="border-top my-3" />

                <DiaryListCard
                    diaries={diaries}
                    selectedYmd={selectedYmd}
                    onOpenReg={onOpenReg}
                    onClickDiary={onClickDiary}
                    onDeleteDiary={onDeleteDiary}
                />
            </div>
        </div>
    );
}
