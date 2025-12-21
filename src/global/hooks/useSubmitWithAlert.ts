import { showModal } from "@/global/utils/showModal";

interface SubmitWithAlertParams<T> {
    submit: (payload: T) => Promise<void>;
    successMessage: string;
    failureMessage: string;
    onSuccess?: () => void;
}

export function useSubmitWithAlert<T>() {
    const submitWithAlert = async ({
                                       submit,
                                       successMessage,
                                       failureMessage,
                                       onSuccess,
                                   }: SubmitWithAlertParams<T>, payload: T) => {
        try {
            await submit(payload);
            await showModal.alert(successMessage);
            onSuccess?.();
        } catch (e) {
            console.error(e);
            await showModal.alert(failureMessage);
        }
    };

    return { submitWithAlert };
}
