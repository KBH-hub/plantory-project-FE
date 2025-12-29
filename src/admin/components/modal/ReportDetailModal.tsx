import { useCallback, useMemo, useState, useEffect } from "react";
import type { ReportDetail } from "@/admin/types/reportManagementType";
import { ModalShell } from "@/admin/components/ModalShell";
import { formatDateTime, formatUTCDateTime } from "@/global/utils/formatDateTime";

function ImageLightbox({
  open,
  src,
  alt,
  onClose,
}: {
  open: boolean;
  src: string | null;
  alt?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !src) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        backgroundColor: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "none",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
          fontSize: 28,
          lineHeight: "44px",
          cursor: "pointer",
          zIndex: 2100,
        }}
      >
        ×
      </button>

      <img
        src={src}
        alt={alt ?? "preview"}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "96vw",
          height: "92vh",
          objectFit: "contain",
          borderRadius: 12,
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
          backgroundColor: "#111",
        }}
      />
    </div>
  );
}

export function ReportDetailModal({
  open,
  onClose,
  detail,
  imageUrl,
}: {
  open: boolean;
  onClose: () => void;
  detail: ReportDetail | null;
  imageUrl: string | null;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const canPreview = useMemo(() => Boolean(imageUrl), [imageUrl]);

  const openPreview = useCallback(() => {
    if (!canPreview) return;
    setPreviewOpen(true);
  }, [canPreview]);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  useEffect(() => {
    if (!open) setPreviewOpen(false);
  }, [open]);

  return (
    <>
      <ModalShell open={open} onClose={onClose} size="xl">
        <div className="modal-header border-0 pb-0">
          <h5 className="modal-title fw-bold fs-4">신고 내용 확인</h5>
          <button className="btn-close" onClick={onClose} type="button" />
        </div>

        <div className="modal-body">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th className="col-3">신고자 아이디</th>
                <td>{detail?.reporterName ?? "-"}</td>
              </tr>
              <tr>
                <th>피신고자 아이디</th>
                <td>{detail?.targetName ?? "-"}</td>
              </tr>
              <tr>
                <th>신고 내용</th>
                <td>{detail?.content ?? "-"}</td>
              </tr>
              <tr>
                <th>신고 일시</th>
                <td>{formatUTCDateTime(detail?.createdAt || "")}</td>
              </tr>
            </tbody>
          </table>

          <hr className="my-4" />

          <h6 className="fw-bold mb-3">근거 사진</h6>
          <div className="p-3 border rounded bg-light">
            {imageUrl ? (
              <div className="d-flex justify-content-center">
                <img
                  src={imageUrl}
                  className="rounded"
                  alt="증거 이미지"
                  style={{
                    cursor: "zoom-in",
                    maxWidth: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                  }}
                  onClick={openPreview}
                />
              </div>
            ) : (
              <span className="text-muted">등록된 근거 사진이 없습니다.</span>
            )}
          </div>

          <hr className="my-4" />

          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th className="col-3">처리 의견</th>
                <td>{detail?.adminMemo ?? "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="modal-footer border-0">
          <button className="btn btn-secondary px-4" onClick={onClose} type="button">
            닫기
          </button>
        </div>
      </ModalShell>

      <ImageLightbox open={previewOpen} src={imageUrl} alt="근거 사진 확대" onClose={closePreview} />
    </>
  );
}
