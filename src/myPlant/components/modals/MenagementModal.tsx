import type { ReactNode } from "react";

type ModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    size?: "lg" | "md";
    headerClassName?: string;
    children: ReactNode;
};

export default function Modal({ open, title, onClose, size = "lg", headerClassName, children }: ModalProps) {
    if (!open) return null;

    const dialogClass = size === "lg" ? "modal-dialog modal-lg modal-dialog-centered" : "modal-dialog modal-dialog-centered";

    return (
        <>
            <div className="modal fade show" style={{ display: "block" }} role="dialog" aria-modal="true">
                <div className={dialogClass} role="document">
                    <div className="modal-content border-0">
                        <div className={`modal-header ${headerClassName ?? ""}`}>
                            <h5 className="modal-title fw-bold">{title}</h5>
                            <button type="button" className="btn-close bg-white rounded-circle" onClick={onClose} aria-label="Close" />
                        </div>
                        <div className="modal-body">{children}</div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose} />
        </>
    );
}
