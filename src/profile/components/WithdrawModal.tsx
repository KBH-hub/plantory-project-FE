// src/profile/components/WithdrawModal.tsx
import React, { useEffect, useState } from "react";
import useLogout from "@/global/hooks/useLogout";
import { showModal } from "@/global/utils/showModal";
import { profileApi } from "@/profile/services/profileService";

type Props = {
    open: boolean;
    onClose: () => void;
};

const WithdrawModal: React.FC<Props> = ({ open, onClose }) => {
    const [withdrawAgree, setWithdrawAgree] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const logout = useLogout();

    // 모달을 다시 열 때 체크 상태 초기화(UX)
    useEffect(() => {
        if (open) {
            setWithdrawAgree(false);
            setIsSubmitting(false);
        }
    }, [open]);

    if (!open) return null;

    const handleWithdraw = async () => {
        if (!withdrawAgree || isSubmitting) return;

        try {
            setIsSubmitting(true);

            await profileApi.withdraw();
            await logout();

        } catch (e) {
            console.log(e);
            await showModal.alert("회원 탈퇴에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">회원탈퇴</h5>
                        <button type="button" className="btn-close" onClick={onClose} disabled={isSubmitting} />
                    </div>

                    <div className="modal-body text-center">
                        <p className="text-danger fw-bold fs-5">정말로 탈퇴하시겠습니까?</p>

                        <p className="text-muted small">
                            탈퇴 시 모든 개인 정보와 데이터가 삭제되며, 복구가 불가능합니다.
                            <br />
                            단, 관련 법령에 따라 일부 정보는 일정 기간 보관될 수 있습니다.
                            <br />
                            탈퇴 후 5일 이내에는 동일한 아이디로 재가입이 제한됩니다.
                        </p>

                        <div className="form-check d-flex justify-content-center align-items-center mt-4">
                            <input
                                className="form-check-input me-1"
                                type="checkbox"
                                checked={withdrawAgree}
                                onChange={(e) => setWithdrawAgree(e.target.checked)}
                                id="agreeWithdrawCheck"
                                disabled={isSubmitting}
                            />
                            <label className="form-check-label fw-bold" htmlFor="agreeWithdrawCheck">
                                위의 사항에 동의합니다.
                            </label>
                        </div>

                        {!withdrawAgree && <span className="text-danger small">*동의해야 회원탈퇴가 가능합니다.</span>}
                    </div>

                    <div className="modal-footer border-0 d-flex justify-content-center gap-5">
                        <button type="button" className="btn btn-secondary btn-lg px-5" onClick={onClose} disabled={isSubmitting}>
                            취소
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-lg px-5"
                            disabled={!withdrawAgree || isSubmitting}
                            onClick={handleWithdraw}
                        >
                            {isSubmitting ? "처리 중..." : "회원 탈퇴"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawModal;