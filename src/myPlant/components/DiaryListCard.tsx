import React from "react";
import type { DiaryListItem } from "@/myPlant/types/plantCalendar";
import { toLocalYmd } from "@/myPlant/utils/calenderDate";

type Props = {
    diaries: DiaryListItem[];
    selectedYmd: string;
    onOpenReg: (ymd: string) => void;
    onClickDiary: (diaryId: number) => void;
    onDeleteDiary: (diaryId: number) => void;
};

export default function DiaryListCard({ diaries, selectedYmd, onOpenReg, onClickDiary, onDeleteDiary }: Props) {
    return (
        <div className="card shadow-sm">
            <div className="card-header bg-warning p-2 d-flex justify-content-between align-items-center">
                <span className="fw-semibold">
                    <i className="bi bi-journal-text me-2" />
                    관찰일지
                </span>
                <button type="button" className="btn btn-dark btn-sm" onClick={() => onOpenReg(selectedYmd)}>
                    + 오늘의 관찰일지 추가
                </button>
            </div>

            <div className="card-body">
                {diaries.length === 0 ? (
                    <div className="text-muted">최근 작성된 관찰일지가 없습니다.</div>
                ) : (
                    <div className="d-grid gap-2">
                        {diaries
                            .slice()
                            .reverse()
                            .map((d: any) => {
                                const thumb = d.photoUrls?.[0];
                                return (
                                    <div key={d.diaryId} className="d-flex flex-column bg-warning bg-opacity-10 rounded-2 border-start border-4 border-warning p-3">
                                        <div className="d-flex align-items-start">
                                            <div
                                                role="button"
                                                className="d-flex align-items-center gap-2 flex-grow-1"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => onClickDiary(Number(d.diaryId))}
                                            >
                                                {thumb ? <img src={thumb} width={60} height={60} className="rounded" alt="thumb" /> : null}
                                                <div className="fw-bold">{d.name || "-"}</div>
                                            </div>

                                            <div className="d-flex align-items-center gap-3 ms-2">
                                                <span className="badge bg-warning text-dark">{toLocalYmd(d.createdAt)}</span>
                                                <button
                                                    type="button"
                                                    className="btn btn-link text-secondary p-0"
                                                    aria-label="이 관찰일지 삭제"
                                                    onClick={() => onDeleteDiary(Number(d.diaryId))}
                                                >
                                                    <i className="fa-solid fa-xmark fs-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 bg-light rounded-1 p-2">
                                            <small className="text-muted">메모: {d.memo || "-"}</small>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
