import React, { useMemo, useRef } from "react";
import { usePaginator } from "@/global/hooks/usePaginator";
import { getDryDictionaryPage } from "@/dictionary/services/dictionaryApi";
import DictionarySearchBar from "@/dictionary/components/DictionarySearchBar";
import DictionaryList from "@/dictionary/components/DictionaryList";
import type { DictionaryCardItem, DryApiResponse, DryItem } from "@/dictionary/types/dictionaryType";
import {
  CONCURRENCY,
  adaptDryToCardItem,
  asArray,
  byQuery,
  normalize,
  withSearchKey,
} from "@/dictionary/utils/dryDictionaryUtils";
import { useDictionaryPagedSearch } from "@/dictionary/hooks/useDictionaryPagedSearch";

const LIMIT = 10;

export default function DryPlantDictionary() {
  const pagerRef = useRef<HTMLUListElement | null>(null);

  const dict = useDictionaryPagedSearch<DryItem, DictionaryCardItem>({
    limit: LIMIT,
    concurrency: CONCURRENCY,
    getPage: ({ pageNo, numOfRows, signal }) =>
      getDryDictionaryPage({ pageNo, numOfRows, signal }) as Promise<DryApiResponse>,
    asArray,
    withSearchKey,
    byQuery,
    normalizeQuery: normalize,
    adapt: adaptDryToCardItem,
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
        <h3 className="fw-bold mb-4">건조에 강한 실내식물</h3>

        <DictionarySearchBar
          value={dict.q}
          onChange={dict.setQ}
          onSearch={dict.onSearch}
          onReset={() => dict.onReset({ noReactionWhenServer: true })}
          label="식물명"
          placeholder="식물명(표준·유통명)"
        />

        <div className="mt-4">
          {dict.loading && <div className="text-center text-muted py-3">불러오는 중...</div>}

          <div className="mt-4">
            <DictionaryList items={dict.items} loading={dict.loading} />
          </div>

          <div className="d-flex justify-content-center py-3">
            <nav aria-label="건조식물사전 페이지">
              <ul className="pagination pagination-sm mb-0" ref={pagerRef}></ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
