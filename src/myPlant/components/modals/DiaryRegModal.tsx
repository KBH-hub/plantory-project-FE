import React from "react";
import type { MyPlantItem } from "@/myPlant/types/plantCalendar";
import type { DiaryFormErrors } from "@/myPlant/types/plantCalendar";

export function cn(...args: Array<string | false | null | undefined>) {
    return args.filter(Boolean).join(" ");
}

type Props = {
    photoFiles: File[];
    onRemovePhotoAt: (idx: number) => void;
    onOpenImageAdd: () => void;

    myPlants: MyPlantItem[];

    regMyplantId: number | "";
    regActivity: string;
    regState: string;
    regMemo: string;

    errors: DiaryFormErrors;

    saving: boolean;

    onClose: () => void;
    onChangeMyplantId: (v: number | "") => void;
    onChangeActivity: (v: string) => void;
    onChangeState: (v: string) => void;
    onChangeMemo: (v: string) => void;
    onClearError: (k: keyof DiaryFormErrors) => void;

    onSubmit: () => void;
};

export default function DiaryRegModal({
    photoFiles,
    onRemovePhotoAt,
    onOpenImageAdd,
    myPlants,
    regMyplantId,
    regActivity,
    regState,
    regMemo,
    errors,
    saving,
    onClose,
    onChangeMyplantId,
    onChangeActivity,
    onChangeState,
    onChangeMemo,
    onClearError,
    onSubmit,
}: Props) {
    return (
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
                <div className="modal-header bg-warning text-white border-0">
                    <h5 className="modal-title fw-bold">관찰일지 등록</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={onClose} />
                </div>

                <div className="modal-body">
                    <div className="fw-bold mb-2">사진</div>
                    <div className="d-flex gap-3 align-items-center mb-3 flex-wrap">
                        {photoFiles.map((f, idx) => {
                            const url = URL.createObjectURL(f);
                            return (
                                <div key={`${f.name}-${idx}`} className="position-relative" style={{ width: 110, height: 110 }}>
                                    <img src={url} className="w-100 h-100 rounded" style={{ objectFit: "cover" }} alt="preview" />
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 px-1"
                                        onClick={() => onRemovePhotoAt(idx)}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            className="d-flex justify-content-center align-items-center border rounded bg-light"
                            style={{ width: 110, height: 110, cursor: "pointer" }}
                            onClick={onOpenImageAdd}
                        >
                            <span className="fs-1">+</span>
                        </button>
                    </div>

                    <label className="fw-bold">
                        식물 선택 <span className="text-danger">*</span>
                    </label>
                    <select
                        className={cn("form-select", errors.myplantId && "is-invalid")}
                        required
                        value={regMyplantId}
                        onChange={(e) => {
                            onChangeMyplantId(e.target.value ? Number(e.target.value) : "");
                            onClearError("myplantId");
                        }}
                    >
                        <option value="" hidden>
                            선택하세요
                        </option>
                        {myPlants.map((p: any) => (
                            <option key={p.myplantId} value={p.myplantId}>
                                {p.name} (ID:{p.myplantId})
                            </option>
                        ))}
                    </select>
                    {errors.myplantId ? <div className="text-danger small mt-1 mb-2">{errors.myplantId}</div> : <div className="mb-2" />}

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="fw-bold">
                                활동 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={cn("form-control", errors.activity && "is-invalid")}
                                placeholder="예: WATERING"
                                value={regActivity}
                                onChange={(e) => {
                                    onChangeActivity(e.target.value);
                                    onClearError("activity");
                                }}
                            />
                            {errors.activity ? <div className="text-danger small mt-1">{errors.activity}</div> : null}
                        </div>

                        <div className="col-md-6">
                            <label className="fw-bold">
                                식물 상태 <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className={cn("form-control", errors.state && "is-invalid")}
                                placeholder="예: GOOD"
                                value={regState}
                                onChange={(e) => {
                                    onChangeState(e.target.value);
                                    onClearError("state");
                                }}
                            />
                            {errors.state ? <div className="text-danger small mt-1">{errors.state}</div> : null}
                        </div>
                    </div>

                    <label className="fw-bold mt-3">
                        메모 <span className="text-danger">*</span>
                    </label>
                    <textarea
                        className={cn("form-control", errors.memo && "is-invalid")}
                        rows={4}
                        placeholder="내용을 입력하세요"
                        value={regMemo}
                        onChange={(e) => {
                            onChangeMemo(e.target.value);
                            onClearError("memo");
                        }}
                    />
                    {errors.memo ? <div className="text-danger small mt-1">{errors.memo}</div> : null}
                </div>

                <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        닫기
                    </button>
                    <button type="button" className="btn btn-success" disabled={saving} onClick={onSubmit}>
                        {saving ? "저장 중..." : "일지 저장"}
                    </button>
                </div>
            </div>
        </div>
    );
}
