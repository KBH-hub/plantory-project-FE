import type { DictionaryCardItem, DryItem } from "@/dictionary/types/dictionary";

export const CONCURRENCY = 10;

export function asArray<T>(v: T | T[] | null | undefined): T[] {
  if (Array.isArray(v)) return v;
  if (v == null) return [];
  return [v];
}

export function stripHtml(s: unknown) {
  if (s == null) return "";
  return String(s).replace(/<[^>]*>/g, "");
}

export function normalize(s: unknown) {
  return stripHtml(s).toLowerCase().trim();
}

export function firstTruthy(...args: unknown[]) {
  for (const x of args) {
    const t = x == null ? "" : String(x).trim();
    if (t) return t;
  }
  return "";
}

export function withSearchKey(it: DryItem): DryItem {
  const cntntsSj = normalize(it?.cntntsSj);
  return { ...it, _searchKey: cntntsSj };
}

export function byQuery(qNorm: string) {
  return (it: DryItem) => (it._searchKey ?? "").includes(qNorm);
}

export function adaptDryToCardItem(it: DryItem): DictionaryCardItem {
  const title = stripHtml(it?.cntntsSj || "") || "(제목 없음)";
  const thumb = firstTruthy(it?.thumbImgUrl1, it?.thumbImgUrl2, it?.imgUrl1, it?.imgUrl2);
  const full = firstTruthy(it?.imgUrl1, it?.imgUrl2, it?.thumbImgUrl1, it?.thumbImgUrl2);

  return {
    cntntsNo: it?.cntntsNo,
    cntntsSj: title,
    distbNm: "",
    rtnThumbFileUrl: "",
    rtnFileUrl: "",
    thumbUrl: thumb,
    imageUrl: full,
  };
}
