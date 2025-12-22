import React, {FC, useRef} from "react";
import ProfileImage, {ProfileImageHandle} from "@/global/components/ProfileImage";
import MemberForm from "@/member/components/MemberForm";
import ChangePasswordModal from "@/profile/components/modals/ChangePasswordModal";
import WithdrawModal from "@/profile/components/modals/WithdrawModal";
import { MemberFormValues } from "@/member/types/memberType";
import {DuplicateCheckResult} from "@/member/hooks/useDuplicateCheck";

type Props = {
    loading: boolean;
    values: MemberFormValues;
    profileImageUrl: string | null;

    nicknameCheck: DuplicateCheckResult;
    idCheckDummy: DuplicateCheckResult;

    onChange: <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => void;
    onFileChange: (file: File | null) => void;
    onSubmit: () => void;
    onCheckNickname: () => void;

    showPwModal: boolean;
    showWithdrawModal: boolean;
    onOpenPwModal: () => void;
    onClosePwModal: () => void;
    onOpenWithdrawModal: () => void;
    onCloseWithdrawModal: () => void;

    onCancel: () => void;
};

const UpdateProfile: FC<Props> = ({
                                            loading,
                                            values,
                                            profileImageUrl,
                                            nicknameCheck,
                                            idCheckDummy,
                                            onChange,
                                            onFileChange,
                                            onSubmit,
                                            onCheckNickname,
                                            showPwModal,
                                            showWithdrawModal,
                                            onOpenPwModal,
                                            onClosePwModal,
                                            onOpenWithdrawModal,
                                            onCloseWithdrawModal,
                                            onCancel,
                                        }) => {
    useRef<ProfileImageHandle | null>(null);
    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center text-muted">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="container mt-4 pb-4">
                <h4 className="fw-bold border-bottom pb-2">내 프로필</h4>
                <p className="text-muted small mt-1">나의 식물 &gt; 내 프로필 &gt; 내 정보 변경</p>

                <div className="mt-4 d-flex justify-content-center">
                    <ProfileImage
                        src={profileImageUrl}
                        size={150}
                        onFileChange={onFileChange}
                    />

                </div>

                <div className="mt-4 px-3">
                    <MemberForm
                        mode="edit"
                        values={values}
                        onChange={onChange}
                        idCheck={idCheckDummy}
                        nicknameCheck={nicknameCheck}
                        onSubmit={onSubmit}
                        onCheckNickname={onCheckNickname}
                        showNoticeToggle={true}
                        showPasswordFields={false}
                        hideSubmitButton={true}
                    />

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={onOpenWithdrawModal}>
                            회원탈퇴
                        </button>

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-danger" onClick={onCancel}>
                                취소
                            </button>
                            <button type="button" className="btn btn-success" onClick={onSubmit}>
                                확인
                            </button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <button type="button" className="btn btn-outline-dark" onClick={onOpenPwModal}>
                            비밀번호 변경
                        </button>
                    </div>
                </div>
            </div>

            <ChangePasswordModal open={showPwModal} onClose={onClosePwModal} />
            <WithdrawModal open={showWithdrawModal} onClose={onCloseWithdrawModal} />
        </div>
    );
};

export default UpdateProfile;
