import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileImage from "@/global/components/ProfileImage";
import MemberForm from "@/member/components/MemberForm";
import { useDuplicateCheck } from "@/member/hooks/useDuplicateCheck";
import { showModal } from "@/global/utils/showModal";
import ChangePasswordModal from "@/profile/components/ChangePasswordModal";
import WithdrawModal from "@/profile/components/WithdrawModal";
import { axiosInstance } from "@/global/services/api/axiosInstance";

type ProfileMeResponse = {
    membername: string;
    nickname: string;
    phone: string;
    address: string;
    noticeEnabled: 0 | 1;
    profileImageUrl?: string | null;
};

type MemberFormValues = {
    membername: string;
    nickname: string;
    phone: string;
    address: string;
    password: string;
    pwCheck: string;
    noticeEnabled: boolean;
};

type UpdateMemberRequest = {
    nickname?: string;
    phone?: string;
    address?: string;
    noticeEnabled?: 0 | 1;
};

const UpdateProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [original, setOriginal] = useState<ProfileMeResponse | null>(null);

    const [values, setValues] = useState<MemberFormValues>({
        membername: "",
        nickname: "",
        phone: "",
        address: "",
        password: "",
        pwCheck: "",
        noticeEnabled: true,
    });

    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [showPwModal, setShowPwModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);

    const checkNickname = async (nickname: string): Promise<boolean> => {
        const res = await axiosInstance.get(`/api/members/checkNickname`, { params: { nickname } });
        return !res.data.exists;
    };

    const nicknameCheck = useDuplicateCheck({
        checkFn: checkNickname,
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
                const res = await axiosInstance.get<ProfileMeResponse>("/api/profile/me");
                const me = res.data;

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
                setProfileImageUrl(me.profileImageUrl ?? null);
                nicknameCheck.reset();
                console.log("me response", res.data);
            } catch (e) {
                console.log(e);
                await showModal.alert("프로필 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChange = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        if (key === "nickname") nicknameCheck.reset();
    };

    const handleCheckNickname = async () => {
        const current = (values.nickname ?? "").trim();
        if (!current) {
            await showModal.alert("닉네임을 입력해주세요.");
            return;
        }
        if (original && current === (original.nickname ?? "")) {
            await showModal.alert("닉네임이 기존과 동일합니다.");
            return;
        }
        await nicknameCheck.check(current);
    };

    const canSubmitNickname = () => {
        const current = (values.nickname ?? "").trim();
        if (!original) return false;
        if (current === (original.nickname ?? "")) return true;
        return nicknameCheck.isValidFor(current);
    };

    const handleSubmit = async () => {
        if (!original) return;

        if (!canSubmitNickname()) {
            await showModal.alert("닉네임 중복 확인을 먼저 해주세요.");
            return;
        }

        const payload: UpdateMemberRequest = {};

        const nickname = (values.nickname ?? "").trim();
        if (nickname !== (original.nickname ?? "")) payload.nickname = nickname;

        if ((values.phone ?? "") !== (original.phone ?? "")) payload.phone = values.phone ?? "";

        if ((values.address ?? "") !== (original.address ?? "")) payload.address = values.address ?? "";

        const noticeEnabledNum: 0 | 1 = values.noticeEnabled ? 1 : 0;
        if (noticeEnabledNum !== original.noticeEnabled) payload.noticeEnabled = noticeEnabledNum;

        try {
            await axiosInstance.put("/api/profile", payload);

            if (selectedFile) {
                const formData = new FormData();
                formData.append("profileImage", selectedFile);

                await axiosInstance.post("/api/profile/picture", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            await showModal.alert("프로필이 수정되었습니다.");
            navigate(-1);
        } catch (e) {
            console.log(e);
            await showModal.alert("프로필 수정에 실패했습니다.");
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center text-muted">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-light">
            <div className="container mt-4 pb-4">
                <h4 className="fw-bold border-bottom pb-2">내 프로필</h4>
                <p className="text-muted small mt-1">나의 식물 &gt; 내 프로필 &gt; 내 정보 변경</p>

                <div className="mt-4 d-flex justify-content-center">
                    <ProfileImage
                        src={profileImageUrl}
                        size={150}
                        onFileChange={(file) => {
                            if (!file) return;
                            if (!file.type.startsWith("image/")) {
                                showModal.alert("이미지 파일만 업로드 가능합니다.");
                                return;
                            }
                            setSelectedFile(file);
                        }}
                    />
                </div>

                <div className="mt-4 px-3">
                    <MemberForm
                        mode="edit"
                        values={values}
                        onChange={onChange}
                        idCheck={idCheckDummy}
                        nicknameCheck={nicknameCheck}
                        onSubmit={handleSubmit}
                        onCheckNickname={handleCheckNickname}
                        showNoticeToggle={true}
                        showPasswordFields={false}
                    />

                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setShowWithdrawModal(true)}>
                            회원탈퇴
                        </button>

                        <div className="d-flex gap-2">
                            <button type="button" className="btn btn-danger" onClick={() => navigate(-1)}>
                                취소
                            </button>
                            <button type="button" className="btn btn-success" onClick={handleSubmit}>
                                확인
                            </button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <button type="button" className="btn btn-outline-dark" onClick={() => setShowPwModal(true)}>
                            비밀번호 변경
                        </button>
                    </div>
                </div>
            </div>

            <ChangePasswordModal open={showPwModal} onClose={() => setShowPwModal(false)} />
            <WithdrawModal open={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} />
        </div>
    );
};

export default UpdateProfilePage;
