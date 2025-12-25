import AddressSelect from "@/global/components/AddressSelect";
import {MemberFormValues} from "@/member/types/memberType";

type DuplicateCheckLike = {
    isAvailable: boolean | null;
    isChecking: boolean;
    message: string;
    check: (value: string) => Promise<void>;
    reset: () => void;
    // useDuplicateCheck에 이미 있다면 타입에 추가
    isValidFor?: (currentValue: string) => boolean;
};

type MemberFormProps = {
    mode: "signup" | "edit";
    values: MemberFormValues;
    onChange: <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => void;
    idCheck: DuplicateCheckLike;
    nicknameCheck: DuplicateCheckLike;
    onSubmit: () => void;
    onCheckNickname?: () => void;
    showNoticeToggle?: boolean;
    showPasswordFields?: boolean;
    hideSubmitButton?: boolean;
};

const MemberForm = ({
                        mode,
                        values,
                        onChange,
                        idCheck,
                        nicknameCheck,
                        onSubmit,
                        onCheckNickname,
                        showNoticeToggle,
                        showPasswordFields,
                        hideSubmitButton,
                    }: MemberFormProps) => {
    const isEdit = mode === "edit";
    const shouldShowNotice = showNoticeToggle ?? isEdit;

    // 기본값: signup은 비번 필드 보임, edit은 숨김
    const shouldShowPassword = showPasswordFields ?? !isEdit;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {/* 아이디 */}
            <label className="fw-bold">아이디 *</label>
            <div className="input-group">
                <input
                    className="form-control"
                    value={values.membername}
                    disabled={isEdit}
                    maxLength={20}
                    placeholder="5~20자, 영문/숫자, . _ - 사용 가능"
                    onChange={(e) => {
                        const next = e.target.value.replace(/\s/g, "");
                        onChange("membername", next);
                    }}
                />
                {!isEdit && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => idCheck.check(values.membername)}
                        disabled={idCheck.isChecking || !ID_REGEX.test(values.membername)}
                        title={!ID_REGEX.test(values.membername) ? "아이디 형식을 확인하세요." : ""}
                    >
                        중복 확인
                    </button>
                )}
            </div>
            {idCheck.message && (
                <p className={`small ${idCheck.isAvailable ? "text-success" : "text-danger"}`}>
                    {idCheck.message}
                </p>
            )}

            {/* 닉네임 */}
            <label className="fw-bold mt-3">닉네임 *</label>
            <div className="input-group">
                <input
                    className="form-control"
                    value={values.nickname}
                    onChange={(e) => onChange("nickname", e.target.value)}
                />
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => (onCheckNickname ? onCheckNickname() : nicknameCheck.check(values.nickname))}
                    disabled={nicknameCheck.isChecking}
                >
                    중복 확인
                </button>
            </div>
            {nicknameCheck.message && (
                <p className={`small ${nicknameCheck.isAvailable ? "text-success" : "text-danger"}`}>
                    {nicknameCheck.message}
                </p>
            )}
            <br/>

            {/* 주소 */}
            <AddressSelect
                value={values.address}
                onChange={(addr) => onChange("address", addr)}
            />


            {/* 휴대전화 */}
            <input
                className="form-control mt-3"
                placeholder="휴대전화"
                value={values.phone}
                onChange={(e) => onChange("phone", e.target.value)}
            />

            {/* 알림 설정 */}
            {shouldShowNotice && (
                <>
                    <label className="fw-bold mt-3">알림 설정</label>
                    <div className="form-check form-switch mt-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={values.noticeEnabled}
                            onChange={(e) => onChange("noticeEnabled", e.target.checked)}
                        />
                    </div>
                </>
            )}

            {shouldShowPassword && (
                <>
                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder={isEdit ? "새 비밀번호(변경 시에만 입력)" : "비밀번호"}
                        value={values.password}
                        onChange={(e) => onChange("password", e.target.value)}
                    />
                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder={isEdit ? "새 비밀번호 확인" : "비밀번호 확인"}
                        value={values.pwCheck}
                        onChange={(e) => onChange("pwCheck", e.target.value)}
                    />
                </>
            )}

            {!hideSubmitButton && (
                <button className="btn btn-success w-100 mt-4">
                    {isEdit ? "저장" : "가입하기"}
                </button>
            )}

        </form>
    );
};

export default MemberForm;
