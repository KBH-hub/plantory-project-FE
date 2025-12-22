// /profile/pages/UpdateProfile.tsx
import React from "react";
import { useUpdateProfile } from "@/profile/hooks/useUpdateProfile";
import UpdateProfileForm from "@/profile/components/UpdateProfile";

const UpdateProfilePage: React.FC = () => {
    const vm = useUpdateProfile();

    return (
        <UpdateProfileForm
            loading={vm.loading}
            values={vm.values}
            profileImageUrl={vm.profileImageUrl}
            nicknameCheck={vm.nicknameCheck}
            idCheckDummy={vm.idCheckDummy}
            onChange={vm.onChange}
            onFileChange={vm.onFileChange}
            onSubmit={vm.handleSubmit}
            onCheckNickname={vm.handleCheckNickname}
            showPwModal={vm.showPwModal}
            showWithdrawModal={vm.showWithdrawModal}
            onOpenPwModal={() => vm.setShowPwModal(true)}
            onClosePwModal={() => vm.setShowPwModal(false)}
            onOpenWithdrawModal={() => vm.setShowWithdrawModal(true)}
            onCloseWithdrawModal={() => vm.setShowWithdrawModal(false)}
            onCancel={vm.goBack}
        />
    );
};

export default UpdateProfilePage;