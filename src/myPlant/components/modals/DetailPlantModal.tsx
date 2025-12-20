import Modal from "@/myPlant/components/modals/MenagementModal";
import type { DetailPlantModalProps } from "@/myPlant/types/myPlantManagement";
import PhotoPicker from "@/myPlant/components/PhotoPicker";
import WateringFields from "@/myPlant/components/WateringFields";

export default function DetailPlantModal({
    open,
    onClose,
    currentVM,
    preview,
    file,
    form,
    hasWatering,
    deletingWatering,
    onChangeForm,
    onChangeFile,
    onClickPhotoDelete,
    onSubmitEdit,
    onDeletePlant,
    onDeleteWatering,
}: DetailPlantModalProps) {
    const canDeletePhoto = (Number.isFinite(Number(currentVM?.fileId)) && Number(currentVM?.fileId) > 0) || !!file;

    return (
        <Modal open={open} title="나의 식물 상세" onClose={onClose} headerClassName="bg-success text-white">
            <PhotoPicker
                title="프로필 사진"
                preview={preview}
                inputMaxWidth={360}
                onChangeFile={onChangeFile}
                rightSlot={
                    <button type="button" className="btn btn-outline-danger" disabled={!canDeletePhoto} onClick={onClickPhotoDelete}>
                        {file ? "선택한 이미지 취소" : "사진 삭제"}
                    </button>
                }
            />

            <label className="fw-bold mt-2">
                식물 이름 <span className="text-danger">*필수입니다.</span>
            </label>
            <input
                type="text"
                className="form-control"
                placeholder="예: 테라리움"
                value={form.name}
                onChange={(e) => onChangeForm((prev) => ({ ...prev, name: e.target.value }))}
            />

            <label className="fw-bold mt-2">식물 종류</label>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="예: 산세베리아 '하니'"
                    value={form.type}
                    onChange={(e) => onChangeForm((prev) => ({ ...prev, type: e.target.value }))}
                />
            </div>

            <label className="fw-bold mt-2">비료 정보</label>
            <input
                type="text"
                className="form-control"
                placeholder="예: 비료는 보통 요구함"
                value={form.fertilizer}
                onChange={(e) => onChangeForm((prev) => ({ ...prev, fertilizer: e.target.value }))}
            />

            <label className="fw-bold mt-2">생육 온도</label>
            <input
                type="text"
                className="form-control"
                placeholder="예: 18–27℃"
                value={form.temp}
                onChange={(e) => onChangeForm((prev) => ({ ...prev, temp: e.target.value }))}
            />

            <WateringFields
                form={{ startAt: form.startAt, intervalDays: form.intervalDays, endDate: form.endDate }}
                onChange={(next) => onChangeForm((prev) => ({ ...prev, ...next }))}
            />

            <div className="d-flex w-50 mx-auto">
                <button type="button" className="btn btn-success fw-bold d-block mx-auto mt-3" onClick={onSubmitEdit}>
                    수정하기
                </button>
                <button type="button" className="btn btn-danger fw-bold d-block mx-auto mt-3" onClick={onDeletePlant}>
                    삭제하기
                </button>
                <button
                    type="button"
                    className="btn btn-outline-danger d-block mx-auto mt-3"
                    disabled={!hasWatering || deletingWatering}
                    onClick={onDeleteWatering}
                >
                    물주기 삭제
                </button>
            </div>
        </Modal>
    );
}
