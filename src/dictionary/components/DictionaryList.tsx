import React from "react";
import type { GardenItem } from "@/dictionary/types/dictionaryType";
import DictionaryCard from "@/dictionary/components/DictionaryCard";

type Props = {
  items: GardenItem[];
  loading: boolean;
};

export default function DictionaryList({ items, loading }: Props) {
  if (!items.length && !loading) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-box" /> 검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <>
      {items.map((item, idx) => (
        <DictionaryCard key={`${String(item.cntntsNo ?? "")}-${idx}`} item={item} />
      ))}
    </>
  );
}
