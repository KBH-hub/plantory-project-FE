// /profile/hooks/useUpdateProfile.ts
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDuplicateCheck } from "@/member/hooks/useDuplicateCheck";
import { showModal } from "@/global/utils/showModal";
import { profileApi } from "@/profile/services/profileService";
import type { ProfileInfo } from "@/profile/types/profileType";

export type MemberFormValues = {
    membername: string;
    nickname: string;
    phone: string;
    address: string;
    password: string;
    pwCheck: string;
    noticeEnabled: boolean;
};

export function useUpdateProfile() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [original, setOriginal] = useState<ProfileInfo | null>(null);

    const [values, setValues] = useState<MemberFormValues>({
        membername: "",
        nickname: "",
        phone: "",
        address: "",
        password: "",
        pwCheck: "",
        noticeEnabled: false,
    });

    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [showPwModal, setShowPwModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const nicknameCheck = useDuplicateCheck({
        checkFn: profileApi.checkNickname,
        emptyMessage: "닉네임을 입력해주세요.",
        successMessage: "사용 가능한 닉네임입니다.",
        failMessage: "이미 사용 중인 닉네임입니다.",
    });

    const idCheckDummy = useMemo(() => {
        return {
            isAvailable: true as boolean | null,
            isChecking: false,
            message: "",
            check: async () => {},
            reset: () => {},
            isValidFor: () => true,
            checkedValue: null as string | null,
        };
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const me = await profileApi.getMyProfile();

                setOriginal(me);
                setValues({
                    membername: me.membername ?? "",
                    nickname: me.nickname ?? "",
                    phone: me.phone ?? "",
                    address: me.address ?? "",
                    password: "",
                    pwCheck: "",
                    noticeEnabled: me.noticeEnabled === 1,
                });
                const pic = await profileApi.getPicture(me.memberId);
                setProfileImageUrl(pic?.imageUrl ?? null);
                nicknameCheck.reset();
            } catch (e) {
                console.log(e);
                await showModal.alert("프로필 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const onChange = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => {
        setValues(prev => ({ ...prev, [key]: value }));
        if (key === "nickname") nicknameCheck.reset();
    };

    const handleCheckNickname = async () => {
        const current = (values.nickname ?? "").trim();
        if (!current) return showModal.alert("닉네임을 입력해주세요.");
        if (original && current === (original.nickname ?? "")) return showModal.alert("닉네임이 기존과 동일합니다.");
        await nicknameCheck.check(current);
    };

    const canSubmitNickname = () => {
        const current = (values.nickname ?? "").trim();
        if (!original) return false;
        if (current === (original.nickname ?? "")) return true;
        return nicknameCheck.isValidFor(current);
    };

    const onFileChange = async (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            await showModal.alert("이미지 파일만 업로드 가능합니다.");
            return;
        }
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!original) return;

        if (!canSubmitNickname()) {
            await showModal.alert("닉네임 중복 확인을 먼저 해주세요.");
            return;
        }

        const payload = {
            nickname: (values.nickname ?? "").trim(),
            phone: (values.phone ?? "").trim(),
            address: (values.address ?? "").trim(),
            noticeEnabled: values.noticeEnabled ? 1 : 0 as 0 | 1,
        };

        try {
            await profileApi.updateProfile(payload);

            if (selectedFile) {
                await profileApi.uploadProfileImage(selectedFile);
            }

            await showModal.alert("프로필이 수정되었습니다.");
            navigate(-1);
        } catch (e) {
            console.log(e);
            await showModal.alert("프로필 수정에 실패했습니다.");
        }
    };

    return {
        loading,
        values,
        original,
        profileImageUrl,
        selectedFile,
        showPwModal,
        showWithdrawModal,
        nicknameCheck,
        idCheckDummy,
        onChange,
        onFileChange,
        handleSubmit,
        handleCheckNickname,
        setShowPwModal,
        setShowWithdrawModal,
        goBack: () => navigate(-1),
    };
}