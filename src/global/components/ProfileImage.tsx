import React, {
    useEffect,
    useMemo,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";

export type ProfileImageHandle = {
    openFilePicker: () => void;
};

type Props = {
    src?: string | null;
    size?: number;
    onFileChange?: (file: File | null) => void;
    disabled?: boolean;
};

const ProfileImage = forwardRef<ProfileImageHandle, Props>(
    ({ src, size = 150, onFileChange, disabled }, ref) => {
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

        useImperativeHandle(ref, () => ({ openFilePicker }));

        const onChangeFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
            const file = e.target.files?.[0] ?? null;

            if (!file || !file.type.startsWith("image/")) {
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
                    disabled={disabled}
                />

                <div
                    className="d-flex justify-content-center align-items-center rounded-circle bg-light border"
                    style={{
                        width: size,
                        height: size,
                        overflow: "hidden",
                        cursor: disabled ? "default" : "pointer",
                    }}
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
            </div>
        );
    }
);

ProfileImage.displayName = "ProfileImage";
export default ProfileImage;