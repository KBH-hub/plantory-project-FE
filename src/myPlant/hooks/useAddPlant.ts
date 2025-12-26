import { useState } from "react";
import defaultImg from "@/assets/images/default.png";
import { showModal } from "@/global/utils/showModal";
import { createMyPlant } from "@/myPlant/services/myPlantManagementApi";
import { isValidWaterDates, toLocalDateTimeStr } from "@/myPlant/utils/managementDate";
import type { PlantForm, UseAddPlantParams } from "@/myPlant/types/myPlantManagementType";
import { createWatering } from "../services/myPlantApi";

export function useAddPlant({ onRefresh }: UseAddPlantParams) {
    const [opened, setOpened] = useState(false);

    const [form, setForm] = useState<PlantForm>({
        name: "",
        type: "",
        fertilizer: "",
        temp: "",
        startAt: "",
        intervalDays: "",
        endDate: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(defaultImg);

    const open = () => setOpened(true);

    const close = () => {
        setOpened(false);
        setForm({
            name: "",
            type: "",
            fertilizer: "",
            temp: "",
            startAt: "",
            intervalDays: "",
            endDate: "",
        });
        setFile(null);
        setPreview(defaultImg);
    };

    const onFileChange = (f: File | null) => {
        setFile(f);
        if (!f) {
            setPreview(defaultImg);
            return;
        }
        if (!f.type?.startsWith("image/")) {
            showModal.alert("이미지 파일만 선택하세요.");
            setFile(null);
            setPreview(defaultImg);
            return;
        }
        const url = URL.createObjectURL(f);
        setPreview(url);
    };

    const submit = async () => {
        const name = form.name.trim();
        if (!name) {
            showModal.alert("식물 이름은 필수입니다.");
            return;
        }

        const startStr = (form.startAt ?? "").trim();
        const endStr = (form.endDate ?? "").trim();
        if (!isValidWaterDates(startStr, endStr)) {
            showModal.alert("최초 물 준일자는 마지막 물 준일자보다 같거나 늦을 수 없습니다.");
            return;
        }

        try {
            await createMyPlant(
                {
                    name,
                    type: form.type.trim(),
                    soil: form.fertilizer.trim(),
                    temperature: form.temp.trim(),
                    startAt: toLocalDateTimeStr(form.startAt),
                    endDate: toLocalDateTimeStr(form.endDate),
                    interval: Number(form.intervalDays || 0),
                },
                file ?? undefined
            );
            await createWatering();

            showModal.alert("등록되었습니다.");
            close();
            await onRefresh();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "등록에 실패했습니다. 잠시 후 다시 시도해주세요.";
            showModal.alert(msg);
        }
    };

    return { opened, open, close, form, setForm, preview, onFileChange, submit };
}
