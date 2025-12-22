import type React from "react";

export function ModalShell({
  open,
  onClose,
  children,
  size,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl";
}) {
  if (!open) return null;

  const dialogSize =
    size === "xl" ? "modal-xl" : size === "lg" ? "modal-lg" : size === "sm" ? "modal-sm" : "";

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} aria-modal="true" role="dialog">
        <div className={`modal-dialog modal-dialog-centered ${dialogSize}`}>
          <div className="modal-content border-0 rounded-3 shadow-lg">{children}</div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}
