import { useCallback, useState } from "react";

interface DuplicateCheckOptions {
    checkFn: (value: string) => Promise<boolean>;
    emptyMessage: string;
    successMessage: string;
    failMessage: string;
    errorMessage?: string;
}

export const useDuplicateCheck = ({
                                      checkFn,
                                      emptyMessage,
                                      successMessage,
                                      failMessage,
                                      errorMessage = "확인 중 오류가 발생했습니다.",
                                  }: DuplicateCheckOptions) => {
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [message, setMessage] = useState("");
    const [isChecking, setIsChecking] = useState(false);
    const [checkedValue, setCheckedValue] = useState<string | null>(null);

    const reset = useCallback(() => {
        setIsAvailable(null);
        setMessage("");
        setCheckedValue(null);
        setIsChecking(false);
    }, []);

    const check = useCallback(
        async (value: string) => {
            const trimmed = value.trim();

            if (!trimmed) {
                setIsAvailable(false);
                setMessage(emptyMessage);
                setCheckedValue(null);
                return;
            }

            setIsChecking(true);
            try {
                const available = await checkFn(trimmed);
                setIsAvailable(available);
                setMessage(available ? successMessage : failMessage);
                setCheckedValue(trimmed);
            } catch {
                setIsAvailable(false);
                setMessage(errorMessage);
                setCheckedValue(null);
            } finally {
                setIsChecking(false);
            }
        },
        [checkFn, emptyMessage, successMessage, failMessage, errorMessage]
    );

    const isValidFor = useCallback(
        (currentValue: string) => {
            return (
                isAvailable === true &&
                checkedValue !== null &&
                checkedValue === currentValue.trim()
            );
        },
        [isAvailable, checkedValue]
    );

    return { isAvailable, message, isChecking, checkedValue, check, reset, isValidFor };
};
