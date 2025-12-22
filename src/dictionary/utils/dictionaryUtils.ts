import type { GardenItem } from "@/dictionary/types/dictionaryType";

export function asArray<T>(v: T | T[] | null | undefined): T[] {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}

export function splitPipes(s?: string) {
  if (!s || typeof s !== "string") return [];
  return s
    .split("|")
    .map((x) => x.trim())
    .filter(Boolean);
}

export function withSearchKey(it: GardenItem): GardenItem {
  const cntntsSj = String(it?.cntntsSj ?? "");
  const distbNm = String(it?.distbNm ?? "");
  return { ...it, _searchKey: (cntntsSj + " " + distbNm).toLowerCase() };
}

export function byQuery(qLower: string) {
  return (it: GardenItem) => (it._searchKey ?? "").includes(qLower);
}

export function buildDetailUrl(cntntsNo: string | number | undefined) {
  const raw = String(cntntsNo ?? "").trim();
  if (!raw) return "/DictionaryDetail";

  const encoded = encodeURIComponent(raw);

  if (raw.length === 6) {
    return `/dryDictionaryDetail/${encoded}`;
  }

  return `/dictionaryDetail/${encoded}`;
}