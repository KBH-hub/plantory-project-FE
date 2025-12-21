import AddressSelect from "@/global/components/AddressSelect";

type MemberFormValues = {
    membername: string;
    nickname: string;
    phone: string;
    address: string;
    password: string;
    pwCheck: string;
};

type DuplicateCheckLike = {
    isAvailable: boolean | null;
    isChecking: boolean;
    message: string;
    check: (value: string) => Promise<void>;
    reset: () => void;
};

type MemberFormProps = {
    mode: "signup" | "edit";
    values: MemberFormValues;
    onChange: <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => void;
    idCheck: DuplicateCheckLike;
    nicknameCheck: DuplicateCheckLike;
    onSubmit: () => void;
};

const MemberForm = ({ mode, values, onChange, idCheck, nicknameCheck, onSubmit }: MemberFormProps) => {
    const isEdit = mode === "edit";

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
                    onChange={(e) => onChange("membername", e.target.value)}
                />
                {!isEdit && (
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => idCheck.check(values.membername)}
                        disabled={idCheck.isChecking}
                    >
                        중복 확인
                    </button>
                )}
            </div>
            {!isEdit && idCheck.message && (
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
                    onClick={() => nicknameCheck.check(values.nickname)}
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

            <AddressSelect onChange={(addr) => onChange("address", addr)} />

            <input
                className="form-control mt-3"
                placeholder="휴대전화"
                value={values.phone}
                onChange={(e) => onChange("phone", e.target.value)}
            />

            <input
                type="password"
                className="form-control mt-3"
                placeholder="비밀번호"
                value={values.password}
                onChange={(e) => onChange("password", e.target.value)}
            />

            <input
                type="password"
                className="form-control mt-3"
                placeholder="비밀번호 확인"
                value={values.pwCheck}
                onChange={(e) => onChange("pwCheck", e.target.value)}
            />

            <button className="btn btn-success w-100 mt-4">{isEdit ? "저장" : "가입하기"}</button>
        </form>
    );
};

export default MemberForm;