import Modal from "@/myPlant/components/modals/MenagementModal";
import type { AddPlantModalProps } from "@/myPlant/types/myPlantManagementType";
import PhotoPicker from "@/myPlant/components/PhotoPicker";
import WateringFields from "@/myPlant/components/WateringFields";

export default function AddPlantModal({ open, onClose, form, preview, onChangeForm, onChangeFile, onSubmit }: AddPlantModalProps) {
    return (
        <Modal open={open} title="나의 식물 등록" onClose={onClose} headerClassName="bg-success text-white">
            <PhotoPicker title="프로필 사진" preview={preview} inputWidth={500} onChangeFile={onChangeFile} />

            <label className="fw-bold">
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

            <button type="button" className="btn btn-success fw-bold d-block mx-auto mt-3" onClick={onSubmit}>
                등록하기
            </button>
        </Modal>
    );
}
