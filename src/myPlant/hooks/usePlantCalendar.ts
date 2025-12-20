import { useEffect, useMemo, useState } from "react";
import {
    deleteDiary,
    getDiaryDetail,
    getDiaryList,
    getMyPlantList,
    getWateringList,
    registerDiary,
    updateWateringCheck,
    type DiaryDetailResponse,
    type DiaryListItem,
    type MyPlantItem,
    type WateringItem,
} from "@/myPlant/services/myPlantServices";
import { showModal } from "@/global/utils/showModal";
import { MODAL_STATE, MAX_PHOTO_FILES, type ModalState } from "@/myPlant/enums/plantCalendarEnums";
import { buildDayRangeISO, buildMonthRangeISO, pad2, toLocalYmd, ymdFromDate } from "@/myPlant/utils/calenderDate";
import { normalizeDiary, normalizeMyPlant, normalizeWater } from "@/myPlant/utils/plantCalendarNormalize";
import type { CalendarCell, DiaryFormErrors } from "@/myPlant/types/plantCalendar";

export function usePlantCalendar() {
    const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth() + 1);
    const [selectedYmd, setSelectedYmd] = useState<string>(() => ymdFromDate(new Date()));

    const [diaries, setDiaries] = useState<DiaryListItem[]>([]);
    const [waters, setWaters] = useState<WateringItem[]>([]);
    const [myPlants, setMyPlants] = useState<MyPlantItem[]>([]);

    const [monthDiaryCount, setMonthDiaryCount] = useState<Record<string, number>>({});
    const [monthWaterCount, setMonthWaterCount] = useState<Record<string, number>>({});

    const [modalState, setModalState] = useState<ModalState>(MODAL_STATE.NONE);

    const [photoFiles, setPhotoFiles] = useState<File[]>([]);
    const [imageDraftFile, setImageDraftFile] = useState<File | null>(null);
    const [imageDraftUrl, setImageDraftUrl] = useState<string>("");

    const [regMyplantId, setRegMyplantId] = useState<number | "">("");
    const [regActivity, setRegActivity] = useState<string>("");
    const [regState, setRegState] = useState<string>("");
    const [regMemo, setRegMemo] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const [detail, setDetail] = useState<DiaryDetailResponse | null>(null);
    const [errors, setErrors] = useState<DiaryFormErrors>({});

    const monthLabel = useMemo(() => `${currentYear}년 ${currentMonth}월`, [currentYear, currentMonth]);

    const monthMeta = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth, 0).getDate();
        return { firstDay, lastDate };
    }, [currentYear, currentMonth]);

    const calendarCells = useMemo<CalendarCell[]>(() => {
        const cells: CalendarCell[] = [];
        for (let i = 0; i < monthMeta.firstDay; i++) cells.push({ type: "EMPTY" });
        for (let day = 1; day <= monthMeta.lastDate; day++) {
            const ymd = `${currentYear}-${pad2(currentMonth)}-${pad2(day)}`;
            cells.push({ type: "DAY", ymd, day });
        }
        return cells;
    }, [currentYear, currentMonth, monthMeta.firstDay, monthMeta.lastDate]);

    async function refreshMonthMark(year: number, month: number) {
        const { start, end } = buildMonthRangeISO(year, month);

        const [rawDiaries, rawWaters] = await Promise.all([
            getDiaryList({ startDate: start, endDate: end }),
            getWateringList({ startDate: start, endDate: end }),
        ]);

        const dList = (Array.isArray(rawDiaries) ? rawDiaries : []).map(normalizeDiary);
        const wList = (Array.isArray(rawWaters) ? rawWaters : []).map(normalizeWater);

        const dCount = dList.reduce<Record<string, number>>((acc, it) => {
            const ymd = toLocalYmd((it as any).createdAt);
            if (ymd) acc[ymd] = (acc[ymd] || 0) + 1;
            return acc;
        }, {});

        const wCount = wList.reduce<Record<string, number>>((acc, it) => {
            const ymd = toLocalYmd((it as any).dateAt);
            if (ymd) acc[ymd] = (acc[ymd] || 0) + 1;
            return acc;
        }, {});

        setMonthDiaryCount(dCount);
        setMonthWaterCount(wCount);
    }

    async function refreshDayPanels(ymd: string) {
        const { start, end } = buildDayRangeISO(ymd);

        const [rawDiaries, rawWaters] = await Promise.all([
            getDiaryList({ startDate: start, endDate: end }),
            getWateringList({ startDate: start, endDate: end }),
        ]);

        const dList = (Array.isArray(rawDiaries) ? rawDiaries : []).map(normalizeDiary);
        const wList = (Array.isArray(rawWaters) ? rawWaters : []).map(normalizeWater);

        setDiaries(dList as any);
        setWaters(wList as any);
    }

    async function initMyPlantsIfNeeded() {
        const raw = await getMyPlantList();
        const list = (Array.isArray(raw) ? raw : []).map(normalizeMyPlant);
        setMyPlants((list as any).filter((x: any) => x.myplantId && x.name));
    }

    function resetRegForm() {
        setRegMyplantId("");
        setRegActivity("");
        setRegState("");
        setRegMemo("");
        setPhotoFiles([]);
        setImageDraftFile(null);
        setImageDraftUrl("");
        setErrors({});
    }

    useEffect(() => {
        refreshMonthMark(currentYear, currentMonth).catch((e) => console.error(e));
    }, [currentYear, currentMonth]);

    useEffect(() => {
        refreshDayPanels(selectedYmd).catch((e) => console.error(e));
    }, [selectedYmd]);

    useEffect(() => {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth() + 1;

        if (y === currentYear && m === currentMonth) {
            setSelectedYmd(ymdFromDate(today));
        } else {
            setSelectedYmd(`${currentYear}-${pad2(currentMonth)}-01`);
        }
    }, [currentYear, currentMonth]);

    function gotoPrevMonth() {
        let y = currentYear;
        let m = currentMonth - 1;
        if (m < 1) {
            m = 12;
            y -= 1;
        }
        setCurrentYear(y);
        setCurrentMonth(m);
    }

    function gotoNextMonth() {
        let y = currentYear;
        let m = currentMonth + 1;
        if (m > 12) {
            m = 1;
            y += 1;
        }
        setCurrentYear(y);
        setCurrentMonth(m);
    }

    function openDiaryRegModal(forYmd: string) {
        setSelectedYmd(forYmd);
        resetRegForm();
        initMyPlantsIfNeeded().catch((e) => console.error(e));
        setModalState(MODAL_STATE.DIARY_REGIST);
    }

    function openImageAddModal() {
        if (photoFiles.length >= MAX_PHOTO_FILES) {
            showModal.alert("사진은 최대 5장까지 업로드 가능합니다.");
            return;
        }
        setImageDraftFile(null);
        setImageDraftUrl("");
        setModalState(MODAL_STATE.IMAGE_ADD);
    }

    function commitImageDraft() {
        if (!imageDraftFile) return;
        if (photoFiles.length >= MAX_PHOTO_FILES) {
            showModal.alert("사진은 최대 5장까지 업로드 가능합니다.");
            return;
        }
        setPhotoFiles((prev) => [...prev, imageDraftFile]);
        setModalState(MODAL_STATE.DIARY_REGIST);
        setImageDraftFile(null);
        setImageDraftUrl("");
    }

    function removePhotoAt(idx: number) {
        setPhotoFiles((prev) => prev.filter((_, i) => i !== idx));
    }

    function validateDiaryForm() {
        const next: DiaryFormErrors = {};

        if (!regMyplantId) next.myplantId = "식물을 선택하세요.";
        if (!regActivity.trim()) next.activity = "활동을 입력하세요.";
        if (!regState.trim()) next.state = "식물 상태를 입력하세요.";
        if (!regMemo.trim()) next.memo = "메모를 입력하세요.";

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function submitDiary() {
        if (!validateDiaryForm()) return;

        try {
            setSaving(true);

            const res = await registerDiary({
                myplantId: Number(regMyplantId),
                activity: regActivity.trim(),
                state: regState.trim(),
                memo: regMemo.trim(),
                files: photoFiles,
            });

            setModalState(MODAL_STATE.NONE);
            await refreshDayPanels(selectedYmd);
            await refreshMonthMark(currentYear, currentMonth);
            resetRegForm();
            showModal.alert("등록되었습니다.");
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.message || "에러";
            showModal.alert("등록 실패: " + msg);
        } finally {
            setSaving(false);
        }
    }

    async function onClickDiaryCard(diaryId: number) {
        try {
            const data = await getDiaryDetail(diaryId);
            setDetail(data as any);
            setModalState(MODAL_STATE.DIARY_DETAIL);
        } catch (e) {
            console.error(e);
            showModal.alert("상세 조회 실패");
        }
    }

    async function onDeleteDiary(diaryId: number) {
        const ok = await showModal.confirm("이 관찰일지를 삭제할까요?");
        if (!ok) return;

        try {
            await deleteDiary(diaryId);
            await refreshDayPanels(selectedYmd);
            await refreshMonthMark(currentYear, currentMonth);
            showModal.alert(`삭제되었습니다.`);
        } catch (e) {
            console.error(e);
            showModal.alert("삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    }

    async function onToggleWatering(wateringId: number) {
        try {
            await updateWateringCheck(wateringId);
            await refreshDayPanels(selectedYmd);
            await refreshMonthMark(currentYear, currentMonth);
        } catch (e) {
            console.error(e);
            showModal.alert("물주기 업데이트 실패");
        }
    }

    const isToday = selectedYmd === ymdFromDate(new Date());

    return {
        state: {
            currentYear,
            currentMonth,
            selectedYmd,
            diaries,
            waters,
            myPlants,
            monthDiaryCount,
            monthWaterCount,
            modalState,
            photoFiles,
            imageDraftFile,
            imageDraftUrl,
            regMyplantId,
            regActivity,
            regState,
            regMemo,
            saving,
            detail,
            errors,
        },
        computed: {
            monthLabel,
            calendarCells,
            isToday,
        },
        actions: {
            setSelectedYmd,
            setModalState,
            setImageDraftFile,
            setImageDraftUrl,
            setRegMyplantId,
            setRegActivity,
            setRegState,
            setRegMemo,
            setErrors,
            gotoPrevMonth,
            gotoNextMonth,
            openDiaryRegModal,
            openImageAddModal,
            commitImageDraft,
            removePhotoAt,
            submitDiary,
            onClickDiaryCard,
            onDeleteDiary,
            onToggleWatering,
        },
    };
}
