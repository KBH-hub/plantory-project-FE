import React from "react";
import type { WateringItem } from "@/myPlant/services/myPlantServices";

type Props = {
    waters: WateringItem[];
    isToday: boolean;
    onToggle: (wateringId: number) => void;
};

export default function WateringCard({ waters, isToday, onToggle }: Props) {
    return (
        <div className="card shadow-sm mb-2">
            <div className="card-header bg-primary p-2 text-white d-flex align-items-center">
                <div style={{ width: 24 }}>
                    <i className="bi bi-droplet" />
                </div>
                <div className="flex-grow-1 text-center">
                    <span className="fw-semibold">물주기</span>
                </div>
                <div style={{ width: 24 }} />
            </div>

            <div className="card-body">
                {waters.length === 0 ? (
                    <div className="text-muted">오늘 물 줄 식물이 없습니다.</div>
                ) : (
                    <div className="d-grid gap-2">
                        {waters.map((w) => {
                            const disabled = !isToday || Boolean((w as any).checkFlag);
                            return (
                                <div key={(w as any).wateringId} className="d-flex align-items-center justify-content-between py-1 border-bottom">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-droplet" />
                                        <span>{(w as any).name || "-"}</span>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        aria-label="물주기 완료"
                                        checked={Boolean((w as any).checkFlag)}
                                        disabled={disabled}
                                        onChange={() => onToggle(Number((w as any).wateringId))}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
