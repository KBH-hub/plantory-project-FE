import AddressSelect from "@/global/components/AddressSelect";
import { MemberFormValues } from "@/member/types/memberType";

export const ID_REGEX = /^(?=.{5,20}$)[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*$/;
export const PASSWORD_REGEX =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
export const formatKoreanPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

type DuplicateCheckLike = {
    isAvailable: boolean | null;
    isChecking: boolean;
    message: string;
    check: (value: string) => Promise<void>;
    reset: () => void;
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
    const shouldShowPassword = showPasswordFields ?? !isEdit;

    const isMembernameValid = ID_REGEX.test(values.membername);
    const isPhoneValid = values.phone.length === 0 ? true : /^010-\d{3,4}-\d{4}$/.test(values.phone);
    const isPasswordValid = values.password.length === 0 ? true : PASSWORD_REGEX.test(values.password);
    const isPwMatch = values.pwCheck.length === 0 ? true : values.password === values.pwCheck;

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
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
                        disabled={idCheck.isChecking || !isMembernameValid}
                        title={!isMembernameValid ? "아이디 형식을 확인하세요." : ""}
                    >
                        중복 확인
                    </button>
                )}
            </div>

            {!isEdit && values.membername.length > 0 && !isMembernameValid && (
                <p className="small text-danger">
                    아이디는 5~20자, 영문/숫자 조합이며 . _ - 는 중간에만 사용할 수 있습니다.
                </p>
            )}

            {idCheck.message && (
                <p className={`small ${idCheck.isAvailable ? "text-success" : "text-danger"}`}>
                    {idCheck.message}
                </p>
            )}

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

            <br />

            <AddressSelect value={values.address} onChange={(addr) => onChange("address", addr)} />

            <input
                className="form-control mt-3"
                placeholder="휴대전화 (예: 010-1234-5678)"
                inputMode="numeric"
                value={values.phone}
                onChange={(e) => {
                    const formatted = formatKoreanPhone(e.target.value);
                    onChange("phone", formatted);
                }}
            />
            {!isPhoneValid && <p className="small text-danger">휴대전화 형식을 확인해주세요. (010-xxxx-xxxx)</p>}

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
                    {!isPasswordValid && (
                        <p className="small text-danger">
                            비밀번호는 최소 8자이며 영문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.
                        </p>
                    )}

                    <input
                        type="password"
                        className="form-control mt-3"
                        placeholder={isEdit ? "새 비밀번호 확인" : "비밀번호 확인"}
                        value={values.pwCheck}
                        onChange={(e) => onChange("pwCheck", e.target.value)}
                    />
                    {!isPwMatch && <p className="small text-danger">비밀번호가 일치하지 않습니다.</p>}
                </>
            )}

            {!hideSubmitButton && (
                <button className="btn btn-success w-100 mt-4" type="submit">
                    {isEdit ? "저장" : "가입하기"}
                </button>
            )}
        </form>
    );
};

export default MemberForm;
