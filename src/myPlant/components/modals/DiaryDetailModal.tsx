import React from "react";
import type { DiaryDetailResponse } from "@/myPlant/services/myPlantServices";

type Props = {
    detail: DiaryDetailResponse | null;
    onClose: () => void;
};

export default function DiaryDetailModal({ detail, onClose }: Props) {
    return (
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header bg-warning text-white border-0">
                    <h5 className="modal-title fw-bold">관찰일지 상세</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose} />
                </div>

                <div className="modal-body">
                    <label className="fw-bold">사진</label>
                    <div className="d-grid mb-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: ".5rem" }}>
                        {detail?.images?.length ? (
                            detail.images
                                .map((it: any) => it.fileUrl)
                                .filter(Boolean)
                                .map((url: string) => (
                                    <div key={url} className="rounded border" style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden" }}>
                                        <img
                                            src={url}
                                            alt="관찰일지 사진"
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                        />
                                    </div>
                                ))
                        ) : (
                            <div className="text-muted small">사진이 없습니다.</div>
                        )}
                    </div>

                    <label className="fw-bold">식물</label>
                    <input className="form-control mb-3" readOnly value={(detail as any)?.diary?.name ?? "-"} />

                    <label className="fw-bold">활동</label>
                    <input className="form-control mb-3" readOnly value={(detail as any)?.diary?.activity ?? ""} />

                    <label className="fw-bold">식물 상태</label>
                    <input className="form-control mb-3" readOnly value={(detail as any)?.diary?.state ?? ""} />

                    <label className="fw-bold">메모</label>
                    <textarea className="form-control" rows={4} readOnly value={(detail as any)?.diary?.memo ?? ""} />

                    <div className="mt-2">
                        <small className="text-muted">작성일: {String((detail as any)?.diary?.createdAt ?? "").slice(0, 10)}</small>
                    </div>
                </div>

                <div className="modal-footer border-0 d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
