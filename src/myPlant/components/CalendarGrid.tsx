import React from "react";
import type { CalendarCell } from "@/myPlant/types/plantCalendar";
import { cn } from "@/myPlant/utils/cn";

type Props = {
    cells: CalendarCell[];
    selectedYmd: string;
    monthDiaryCount: Record<string, number>;
    monthWaterCount: Record<string, number>;
    onSelectDay: (ymd: string) => void;
};

export default function CalendarGrid({ cells, selectedYmd, monthDiaryCount, monthWaterCount, onSelectDay }: Props) {
    return (
        <>
            <div className="d-grid" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
                <div className="fw-bold text-center text-danger">일</div>
                <div className="fw-bold text-center">월</div>
                <div className="fw-bold text-center">화</div>
                <div className="fw-bold text-center">수</div>
                <div className="fw-bold text-center">목</div>
                <div className="fw-bold text-center">금</div>
                <div className="fw-bold text-center text-primary">토</div>
            </div>

            <div className="mt-2" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
                {cells.map((c, idx) => {
                    if (c.type === "EMPTY") {
                        return <div key={`e-${idx}`} className="border rounded bg-white" style={{ minHeight: 110, opacity: 0.3 }} />;
                    }

                    const dCnt = monthDiaryCount[c.ymd] || 0;
                    const wCnt = monthWaterCount[c.ymd] || 0;

                    return (
                        <div
                            key={c.ymd}
                            role="button"
                            tabIndex={0}
                            aria-label={c.ymd}
                            className={cn(
                                "border rounded bg-white p-2",
                                c.ymd === selectedYmd && "border-3 border-dark",
                                (dCnt > 0 || wCnt > 0) && "shadow-sm"
                            )}
                            style={{ minHeight: 110, cursor: "pointer" }}
                            onClick={() => onSelectDay(c.ymd)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onSelectDay(c.ymd);
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-semibold">{c.day}</span>
                            </div>

                            <div className="mt-2 d-grid gap-1">
                                {dCnt > 0 && (
                                    <div className="badge bg-warning text-dark text-start" title={`관찰일지 ${dCnt}건`}>
                                        관찰일지 {dCnt}
                                    </div>
                                )}
                                {wCnt > 0 && (
                                    <div className="badge bg-primary text-start" title={`물주기 ${wCnt}건`}>
                                        물주기 {wCnt}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
