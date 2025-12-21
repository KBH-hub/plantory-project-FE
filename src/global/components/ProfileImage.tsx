import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
    src?: string | null;
    size?: number;
    onFileChange?: (file: File | null) => void;
    disabled?: boolean;
};

const ProfileImage: React.FC<Props> = ({ src, size = 150, onFileChange, disabled }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const displaySrc = useMemo(() => previewUrl ?? src ?? "", [previewUrl, src]);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const openFilePicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0] ?? null;

        if (!file) {
            onFileChange?.(null);
            return;
        }
        if (!file.type.startsWith("image/")) {
            e.target.value = "";
            onFileChange?.(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onFileChange?.(file);
    };

    return (
        <div className="text-center">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onChangeFile}
            />

            <div
                className="d-flex justify-content-center align-items-center rounded-circle bg-light border"
                style={{ width: size, height: size, overflow: "hidden", cursor: disabled ? "default" : "pointer" }}
                onClick={openFilePicker}
                role="button"
                aria-disabled={disabled}
            >
                {displaySrc ? (
                    <img
                        src={displaySrc}
                        alt="profile"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <span className="text-muted small">No Image</span>
                )}
            </div>

            <button
                type="button"
                className="btn btn-primary btn-sm mt-2"
                onClick={openFilePicker}
                disabled={disabled}
            >
                프로필 사진 변경
            </button>
        </div>
    );
};

export default ProfileImage;