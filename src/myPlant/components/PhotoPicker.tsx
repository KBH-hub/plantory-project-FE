import defaultImg from "@/assets/images/default.png";
import type { PhotoPickerProps } from "@/myPlant/types/myPlantManagement";

export default function PhotoPicker({ title, preview, inputWidth, inputMaxWidth, onChangeFile, rightSlot }: PhotoPickerProps) {
    return (
        <div className="text-center mb-2">
            <h6 className="fw-bold">{title}</h6>
            <div className="d-flex justify-content-center">
                <img
                    src={preview || defaultImg}
                    className="plant-preview"
                    style={{ width: 230, height: 230, objectFit: "cover", display: "block" }}
                    alt="preview"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = defaultImg;
                    }}
                />
            </div>
            <div className="mt-2 d-flex gap-2 justify-content-center">
                <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    style={{ width: inputWidth, maxWidth: inputMaxWidth }}
                    onChange={(e) => onChangeFile(e.currentTarget.files?.[0] ?? null)}
                />
                {rightSlot}
            </div>
        </div>
    );
}
