import React, { useRef } from "react";
import { usePaginator } from "@/global/hooks/usePaginator";
import { getGardenDictionaryPage } from "@/dictionary/services/dictionaryServices";
import type { GardenItem } from "@/dictionary/types/dictionary";
import GardenSearchBar from "@/dictionary/components/DictionarySearchBar";
import GardenList from "@/dictionary/components/DictionaryList";
import { asArray, byQuery, withSearchKey } from "@/dictionary/utils/dictionaryUtils";
import { useDictionaryPagedSearch } from "@/dictionary/hooks/useDictionaryPagedSearch";

const LIMIT = 10;
const CONCURRENCY = 10;

const adaptGarden = (it: GardenItem) => it;
const normalizeGarden = (q: string) => q.toLowerCase().trim();

export default function PlantDictionaryGardenPage() {
  const pagerRef = useRef<HTMLUListElement | null>(null);

  const dict = useDictionaryPagedSearch<GardenItem, GardenItem>({
    limit: LIMIT,
    concurrency: CONCURRENCY,
    getPage: ({ pageNo, numOfRows, signal }) => getGardenDictionaryPage({ pageNo, numOfRows, signal }),
    asArray,
    withSearchKey: (it) => withSearchKey(it),
    byQuery: (qNorm) => byQuery(qNorm),
    normalizeQuery: normalizeGarden,
    adapt: adaptGarden,
  });

  usePaginator({
    containerRef: pagerRef,
    current: dict.current,
    totalItems: dict.total,
    pageSize: LIMIT,
    onChange: (page) => dict.setOffset((page - 1) * LIMIT),
  });

  return (
    <div className="bg-light" style={{ overflowX: "auto" }}>
      <div className="mx-auto py-4" style={{ width: 1470, padding: 16 }}>
        <h3 className="fw-bold mb-4">실내 정원용 식물</h3>

        <GardenSearchBar
          value={dict.q}
          onChange={dict.setQ}
          onSearch={dict.onSearch}
          onReset={() => dict.onReset({ noReactionWhenServer: true })}
        />

        <div className="mt-4">
          {dict.loading && <div className="text-center text-muted py-3">불러오는 중...</div>}

          <div className="mt-4">
            <GardenList items={dict.items} loading={dict.loading} />
          </div>

          <div className="d-flex justify-content-center py-3">
            <nav aria-label="식물사전 페이지">
              <ul className="pagination pagination-sm mb-0" ref={pagerRef}></ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
