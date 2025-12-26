export function pad2(n: number) {
    return String(n).padStart(2, "0");
}

export function ymdFromDate(d: Date) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function buildMonthRangeISO(year: number, month: number) {
    const start = `${year}-${pad2(month)}-01T00:00:00`;
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const end = `${nextYear}-${pad2(nextMonth)}-01T00:00:00`;
    return { start, end };
}

export function buildDayRangeISO(ymd: string) {
    return { start: `${ymd}T00:00:00`, end: `${ymd}T23:59:59` };
}

export function toLocalYmd(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function toUtcYmd(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}
