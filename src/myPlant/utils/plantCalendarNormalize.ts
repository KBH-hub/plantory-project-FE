export function isTruthyCheckFlag(v: any) {
    if (v === true) return true;
    if (v === false) return false;
    if (v == null) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (v === 1 || v === "1" || v === "Y" || v === "y" || v === "true") return true;
    return false;
}

export function normalizeWater(raw: any) {
    return {
        wateringId: Number(raw?.wateringId ?? 0),
        name: String(raw?.name ?? "-"),
        dateAt: String(raw?.dateAt ?? ""),
        checkFlag: isTruthyCheckFlag(raw?.checkFlag),
    };
}

export function normalizeDiary(raw: any) {
    return {
        diaryId: Number(raw?.diaryId ?? 0),
        name: String(raw?.name ?? "-"),
        activity: String(raw?.activity ?? raw?.content ?? ""),
        state: String(raw?.state ?? ""),
        memo: String(raw?.memo ?? ""),
        createdAt: String(raw?.createdAt ?? ""),
        photoUrls: Array.isArray(raw?.photoUrls) ? raw.photoUrls : [],
    };
}

export function normalizeMyPlant(raw: any) {
    return {
        myplantId: Number(raw?.myplantId ?? 0),
        name: String(raw?.name ?? "-"),
    };
}
