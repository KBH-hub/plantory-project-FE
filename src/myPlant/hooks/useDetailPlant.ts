import { useState } from "react";
import defaultImg from "@/assets/images/default.png";
import { showModal } from "@/global/utils/showModal";
import type { PlantForm, PlantVm, UseDetailPlantParams } from "@/myPlant/types/myPlantManagementType";
import { deleteMyPlant, deleteWatering, updateMyPlant } from "@/myPlant/services/myPlantManagementApi";
import { formatDate, isValidWaterDates, toLocalDateTimeStr } from "@/myPlant/utils/managementDate";
import { createWatering } from "../services/myPlantApi";

export function useDetailPlant({ onRefresh }: UseDetailPlantParams) {
    const [opened, setOpened] = useState(false);

    const [currentVM, setCurrentVM] = useState<PlantVm | null>(null);
    const [deletePhoto, setDeletePhoto] = useState(false);

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

    const [deletingWatering, setDeletingWatering] = useState(false);

    const hasWatering = form.startAt.trim().length > 0 && form.endDate.trim().length > 0 && Number(form.intervalDays) > 0;

    const open = (p: PlantVm) => {
        setCurrentVM(p);
        setDeletePhoto(false);

        setForm({
            name: p.name ?? "",
            type: p.type ?? "",
            fertilizer: p.soil ?? "",
            temp: p.temperature ?? "",
            startAt: p.startAt ? formatDate(p.startAt) : "",
            intervalDays: p.interval > 0 ? String(p.interval) : "",
            endDate: p.endDate ? formatDate(p.endDate) : "",
        });

        setFile(null);
        setPreview(p.img || defaultImg);
        setOpened(true);
    };

    const close = () => {
        setOpened(false);
        setCurrentVM(null);
        setDeletePhoto(false);
        setFile(null);
    };

    const onFileChange = (f: File | null) => {
        setFile(f);
        if (!f) return;

        if (!f.type?.startsWith("image/")) {
            showModal.alert("이미지 파일만 선택하세요.");
            setFile(null);
            return;
        }

        const url = URL.createObjectURL(f);
        setPreview(url);
        setDeletePhoto(false);
    };

    const onClickPhotoDelete = () => {
        if (!currentVM) return;

        const hasNew = !!file;
        const hasExisting = Number.isFinite(Number(currentVM.fileId)) && Number(currentVM.fileId) > 0;

        if (hasNew) {
            setFile(null);
            setPreview(currentVM.img || defaultImg);
            setDeletePhoto(false);
            return;
        }

        if (hasExisting) {
            setPreview(defaultImg);
            setDeletePhoto(true);
        }
    };

    const submitEdit = async () => {
        if (!currentVM?.id) {
            showModal.alert("수정 대상 식물 정보를 찾지 못했습니다.");
            return;
        }

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

        const delFileId =
            file && Number.isFinite(Number(currentVM.fileId)) && Number(currentVM.fileId) > 0
                ? Number(currentVM.fileId)
                : !file && deletePhoto && Number.isFinite(Number(currentVM.fileId)) && Number(currentVM.fileId) > 0
                  ? Number(currentVM.fileId)
                  : undefined;

        try {
            await updateMyPlant(
                {
                    myplantId: currentVM.id,
                    name,
                    type: form.type.trim(),
                    soil: form.fertilizer.trim(),
                    temperature: form.temp.trim(),
                    startAt: toLocalDateTimeStr(form.startAt),
                    endDate: toLocalDateTimeStr(form.endDate),
                    interval: Number(form.intervalDays || 0),
                },
                { delFile: delFileId, file: file ?? undefined }
            );

            await createWatering();

            showModal.alert("수정되었습니다.");
            close();
            await onRefresh();
        } catch (err: any) {
            const msg = err?.response?.data?.message || "수정 중 오류가 발생했습니다.";
            showModal.alert(msg);
        }
    };

    const deletePlant = async () => {
        if (!currentVM?.id) {
            showModal.alert("삭제 대상 식물 정보를 찾지 못했습니다.");
            return;
        }

        const delFileId =
            Number.isFinite(Number(currentVM.fileId)) && Number(currentVM.fileId) > 0 ? Number(currentVM.fileId) : undefined;

        const ok = await showModal.confirm("식물을 삭제하시겠습니까?");
        if (ok) {
            try {
                await deleteMyPlant({ myplantId: currentVM.id, delFile: delFileId });
                close();
                await onRefresh();
                showModal.alert("삭제되었습니다.");
            } catch (err: any) {
                const msg = err?.response?.data?.message || "삭제 중 오류가 발생했습니다.";
                showModal.alert(msg);
            }
        }
    };

    const deleteWateringAction = async () => {
        const myplantId = currentVM?.id;
        if (!myplantId) {
            showModal.alert("대상 식물 정보를 찾지 못했습니다.");
            return;
        }

        if (deletingWatering) return;

        const ok = await showModal.confirm("물주기를 삭제하시겠습니까?");
        if (!ok) return;

        setDeletingWatering(true);
        try {
            await deleteWatering({ myplantId });
            setForm((prev) => ({ ...prev, startAt: "", intervalDays: "", endDate: "" }));
            showModal.alert("삭제되었습니다.");
        } catch (err: any) {
            const msg = err?.response?.data?.message || "삭제 중 오류가 발생했습니다.";
            showModal.alert(msg);
        } finally {
            setDeletingWatering(false);
        }
    };

    return {
        opened,
        currentVM,
        deletePhoto,
        preview,
        file,
        form,
        deletingWatering,
        hasWatering,
        open,
        close,
        setForm,
        onFileChange,
        onClickPhotoDelete,
        submitEdit,
        deletePlant,
        deleteWatering: deleteWateringAction,
    };
}
