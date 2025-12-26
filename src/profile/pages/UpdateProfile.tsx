import React, { FC } from "react";
import { useUpdateProfile } from "@/profile/hooks/useUpdateProfile";
import UpdateProfileForm from "@/profile/components/UpdateProfile";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { profileApi } from "@/profile/services/profileApi";
import { showModal } from "@/global/utils/showModal";

const UpdateProfilePage: FC = () => {
    const vm = useUpdateProfile();
    const refreshMe = useAuthStore((s) => s.refreshMe);

    const onSubmit = async () => {
        try {
            const payload = {
                nickname: (vm.values.nickname ?? "").trim(),
                phone: (vm.values.phone ?? "").trim(),
                address: (vm.values.address ?? "").trim(),
                noticeEnabled: vm.values.noticeEnabled ? 1 : 0 as 0 | 1,
            };

            await profileApi.updateProfile(payload);
            if (vm.selectedFile) {
                await profileApi.uploadProfileImage(vm.selectedFile);
            }

            await refreshMe();

            await showModal.alert("저장되었습니다.");
        } catch (e) {
            console.error(e);
            await showModal.alert("저장에 실패했습니다.");
        }
    };

    return (
        <UpdateProfileForm
            loading={vm.loading}
            values={vm.values}
            profileImageUrl={vm.profileImageUrl}
            nicknameCheck={vm.nicknameCheck}
            idCheckDummy={vm.idCheckDummy}
            onChange={vm.onChange}
            onFileChange={vm.onFileChange}
            onSubmit={onSubmit}
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
