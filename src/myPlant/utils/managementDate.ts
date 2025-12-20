function toDate(val?: string | null): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? null : d;
}

function daysBetween(from?: string | null): number {
    const d = toDate(from);
    if (!d) return 0;
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

function addDays(dateVal?: string | null, days?: number): Date | null {
    const d = toDate(dateVal);
    if (!d || !Number.isFinite(days)) return null;
    const r = new Date(d);
    r.setDate(r.getDate() + (days as number));
    return r;
}

function formatDate(val?: string | null): string {
    const d = toDate(val);
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function toLocalDateTimeStr(dateStr: string): string {
    if (!dateStr) return "";
    return `${dateStr}T00:00:00`;
}

function isValidWaterDates(startStr: string, endStr: string): boolean {
    const sStr = (startStr ?? "").trim();
    const eStr = (endStr ?? "").trim();

    const hasStart = sStr.length > 0;
    const hasEnd = eStr.length > 0;

    if (!hasStart && !hasEnd) return true;
    if (hasStart !== hasEnd) return false;

    const s = toDate(sStr);
    const e = toDate(eStr);
    if (!s || !e) return false;
    return s.getTime() < e.getTime();
}

export { addDays, daysBetween, formatDate, isValidWaterDates, toDate, toLocalDateTimeStr };
