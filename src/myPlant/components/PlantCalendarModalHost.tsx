import React from "react";
import { MODAL_STATE, type ModalState } from "@/myPlant/enums/plantCalendarEnums";
import type { DiaryFormErrors, DiaryDetailResponse, MyPlantItem } from "@/myPlant/types/plantCalendar";
import DiaryRegModal from "@/myPlant/components/modals/DiaryRegModal";
import ImageAddModal from "@/myPlant/components/modals/ImageAddModal";
import DiaryDetailModal from "@/myPlant/components/modals/DiaryDetailModal";

type Props = {
    modalState: ModalState;

    photoFiles: File[];
    myPlants: MyPlantItem[];

    regMyplantId: number | "";
    regActivity: string;
    regState: string;
    regMemo: string;

    errors: DiaryFormErrors;
    saving: boolean;

    imageDraftFile: File | null;
    imageDraftUrl: string;

    detail: DiaryDetailResponse | null;

    onCloseAll: () => void;

    onOpenImageAdd: () => void;
    onRemovePhotoAt: (idx: number) => void;

    onChangeMyplantId: (v: number | "") => void;
    onChangeActivity: (v: string) => void;
    onChangeState: (v: string) => void;
    onChangeMemo: (v: string) => void;
    onClearError: (k: keyof DiaryFormErrors) => void;

    onSubmit: () => void;

    onBackToReg: () => void;
    onPickDraftFile: (f: File | null, url: string) => void;
    onCommitDraft: () => void;
};

export default function PlantCalendarModalHost({
    modalState,
    photoFiles,
    myPlants,
    regMyplantId,
    regActivity,
    regState,
    regMemo,
    errors,
    saving,
    imageDraftFile,
    imageDraftUrl,
    detail,
    onCloseAll,
    onOpenImageAdd,
    onRemovePhotoAt,
    onChangeMyplantId,
    onChangeActivity,
    onChangeState,
    onChangeMemo,
    onClearError,
    onSubmit,
    onBackToReg,
    onPickDraftFile,
    onCommitDraft,
}: Props) {
    if (modalState === MODAL_STATE.NONE) return null;

    return (
        <div className="modal fade show d-block" role="dialog" aria-modal="true" style={{ background: "rgba(0,0,0,.5)" }}>
            {modalState === MODAL_STATE.DIARY_REGIST && (
                <DiaryRegModal
                    photoFiles={photoFiles}
                    onRemovePhotoAt={onRemovePhotoAt}
                    onOpenImageAdd={onOpenImageAdd}
                    myPlants={myPlants}
                    regMyplantId={regMyplantId}
                    regActivity={regActivity}
                    regState={regState}
                    regMemo={regMemo}
                    errors={errors}
                    saving={saving}
                    onClose={onCloseAll}
                    onChangeMyplantId={onChangeMyplantId}
                    onChangeActivity={onChangeActivity}
                    onChangeState={onChangeState}
                    onChangeMemo={onChangeMemo}
                    onClearError={onClearError}
                    onSubmit={onSubmit}
                />
            )}

            {modalState === MODAL_STATE.IMAGE_ADD && (
                <ImageAddModal
                    imageDraftUrl={imageDraftUrl}
                    imageDraftFile={imageDraftFile}
                    onCloseToReg={onBackToReg}
                    onPickFile={onPickDraftFile}
                    onCommit={onCommitDraft}
                />
            )}

            {modalState === MODAL_STATE.DIARY_DETAIL && <DiaryDetailModal detail={detail} onClose={onCloseAll} />}
        </div>
    );
}
