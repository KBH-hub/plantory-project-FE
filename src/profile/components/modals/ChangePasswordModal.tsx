import React, { useState } from "react";
import { showModal } from "@/global/utils/showModal";
import { profileApi } from "@/profile/services/profileApi";

type Props = {
    open: boolean;
    onClose: () => void;
};

const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
    const [oldPw, setOldPw] = useState("");
    const [newPw, setNewPw] = useState("");
    const [newPwCheck, setNewPwCheck] = useState("");

    if (!open) return null;

    const handleChangePassword = async () => {
        if (!oldPw || !newPw || !newPwCheck) {
            await showModal.alert("모든 비밀번호를 입력해주세요.");
            return;
        }
        if (newPw !== newPwCheck) {
            await showModal.alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const result = await profileApi.changePassword({
                oldPassword: oldPw,
                newPassword: newPw,
            });

            if (result.success) {
                await showModal.alert("비밀번호가 변경되었습니다.");
                setOldPw("");
                setNewPw("");
                setNewPwCheck("");
                onClose();
            } else {
                await showModal.alert("기존 비밀번호가 일치하지 않습니다.");
            }
        } catch (e) {
            console.log(e);
            await showModal.alert("비밀번호 변경 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">비밀번호 변경</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    <div className="modal-body pt-0">
                        <label className="fw-bold">기존 비밀번호</label>
                        <input className="form-control mb-4" type="password" value={oldPw} onChange={(e) => setOldPw(e.target.value)} />

                        <label className="fw-bold">새 비밀번호</label>
                        <input className="form-control mb-4" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />

                        <label className="fw-bold">새 비밀번호 확인</label>
                        <input className="form-control mb-4" type="password" value={newPwCheck} onChange={(e) => setNewPwCheck(e.target.value)} />
                    </div>

                    <div className="modal-footer border-0 d-flex justify-content-center gap-5">
                        <button type="button" className="btn btn-secondary btn-lg px-5" onClick={onClose}>
                            취소
                        </button>
                        <button type="button" className="btn btn-success btn-lg px-5" onClick={handleChangePassword}>
                            변경
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
