import React from "react";

type Props = {
    imageDraftUrl: string;
    imageDraftFile: File | null;
    onCloseToReg: () => void;
    onPickFile: (file: File | null, url: string) => void;
    onCommit: () => void;
};

export default function ImageAddModal({ imageDraftUrl, imageDraftFile, onCloseToReg, onPickFile, onCommit }: Props) {
    return (
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">사진 추가</h5>
                    <button type="button" className="btn-close" onClick={onCloseToReg} />
                </div>

                <div className="modal-body">
                    {imageDraftUrl ? (
                        <img src={imageDraftUrl} className="img-fluid rounded mb-3" style={{ maxHeight: 300, objectFit: "cover" }} alt="draft" />
                    ) : null}

                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            onPickFile(f, f ? URL.createObjectURL(f) : "");
                        }}
                    />
                </div>

                <div className="modal-footer border-0 d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onCloseToReg}>
                        닫기
                    </button>
                    <button type="button" className="btn btn-primary" onClick={onCommit} disabled={!imageDraftFile}>
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
}
