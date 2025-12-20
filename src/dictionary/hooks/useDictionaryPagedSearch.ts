import { useEffect, useMemo, useRef, useState } from "react";

export type DictMode = "server" | "client";

type ApiBody<T> = {
  body?: {
    items?: {
      item?: T | T[] | null;
      totalCount?: string | number;
      numOfRows?: string | number;
      pageNo?: string | number;
    };
  };
};

type GetPage<T> = (params: {
  pageNo: number;
  numOfRows: number;
  signal: AbortSignal;
}) => Promise<ApiBody<T>>;

type UseDictionaryPagedSearchArgs<TItem, TView> = {
  limit: number;
  concurrency: number;

  getPage: GetPage<TItem>;

  asArray: <T>(v: T | T[] | null | undefined) => T[];

  withSearchKey: (it: TItem) => TItem;
  byQuery: (qNorm: string) => (it: TItem) => boolean;

  normalizeQuery: (q: string) => string;

  adapt: (it: TItem) => TView;
};

export function useDictionaryPagedSearch<TItem, TView>(args: UseDictionaryPagedSearchArgs<TItem, TView>) {
  const {
    limit,
    concurrency,
    getPage,
    asArray,
    withSearchKey,
    byQuery,
    normalizeQuery,
    adapt,
  } = args;

  const abortRef = useRef<AbortController | null>(null);
  const allCacheRef = useRef<TItem[]>([]);

  const [mode, setMode] = useState<DictMode>("server");
  const [q, setQ] = useState("");
  const [qNorm, setQNorm] = useState("");

  const [offset, setOffset] = useState(0);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);

  const [itemsToRender, setItemsToRender] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);

  const viewItems = useMemo(() => itemsToRender.map(adapt), [itemsToRender, adapt]);

  useEffect(() => {
    setCurrent(Math.floor(offset / limit) + 1);
  }, [offset, limit]);

  useEffect(() => {
    if (mode !== "server") return;
    const pageNo = Math.floor(offset / limit) + 1;
    loadServerPage(pageNo, limit).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, offset, limit]);

  useEffect(() => {
    if (mode !== "client") return;
    const filtered = allCacheRef.current.filter(byQuery(qNorm));
    renderClientSlice(filtered, offset, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, offset, limit, qNorm]);

  useEffect(() => {
    setMode("server");
    setOffset(0);
    loadServerPage(1, limit).catch(() => {});
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  async function loadServerPage(pageNo: number, numOfRows: number) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getPage({ pageNo, numOfRows, signal: controller.signal });

      const rawItems = asArray(data?.body?.items?.item);
      const totalCount = Number(data?.body?.items?.totalCount ?? 0);

      setItemsToRender(rawItems.map(withSearchKey));
      setTotal(totalCount);
    } catch {
      setItemsToRender([]);
      setTotal(0);
      setOffset(0);
      setMode("server");
    } finally {
      setLoading(false);
    }
  }

  function renderClientSlice(filtered: TItem[], nextOffset: number, pageSize: number) {
    const totalCount = filtered.length;
    const from = Math.max(0, nextOffset);
    const to = Math.min(from + pageSize, totalCount);

    setTotal(totalCount);
    setItemsToRender(filtered.slice(from, to));
  }

  async function collectFirstPage(signal: AbortSignal) {
    const data = await getPage({ pageNo: 1, numOfRows: limit, signal });

    const firstItems = asArray(data?.body?.items?.item);
    const totalCount = Number(data?.body?.items?.totalCount ?? 0);
    const size = Number(data?.body?.items?.numOfRows ?? limit);
    const totalPages = Math.max(1, Math.ceil(totalCount / size));

    return { totalPages, size, firstItems };
  }

  async function collectRestPages(params: {
    totalPages: number;
    size: number;
    signal: AbortSignal;
    onBatch: (batch: TItem[]) => void;
    shouldStop: () => boolean;
  }) {
    const { totalPages, size, signal, onBatch, shouldStop } = params;

    const pages: number[] = [];
    for (let p = 2; p <= totalPages; p++) pages.push(p);

    let idx = 0;

    const worker = async () => {
      while (idx < pages.length && !shouldStop()) {
        const p = pages[idx++];
        const data = await getPage({ pageNo: p, numOfRows: size, signal });
        const batch = asArray(data?.body?.items?.item).map(withSearchKey);
        onBatch(batch);
      }
    };

    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.allSettled(workers);
  }

  async function onSearch() {
    const nextQ = q.trim();

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setOffset(0);

    if (!nextQ) {
      setMode("server");
      setQNorm("");
      allCacheRef.current = [];
      setTotal(0);
      return;
    }

    const nextNorm = normalizeQuery(nextQ);
    setQNorm(nextNorm);

    setMode("client");
    setLoading(true);

    try {
      const { totalPages, size, firstItems } = await collectFirstPage(controller.signal);

      allCacheRef.current = asArray(firstItems).map(withSearchKey);

      const filtered0 = allCacheRef.current.filter(byQuery(nextNorm));
      renderClientSlice(filtered0, 0, limit);

      collectRestPages({
        totalPages,
        size,
        signal: controller.signal,
        onBatch: (batch) => {
          allCacheRef.current.push(...batch);
          const f = allCacheRef.current.filter(byQuery(nextNorm));
          renderClientSlice(f, 0, limit);
        },
        shouldStop: () => false,
      }).catch(() => {});
    } finally {
      setLoading(false);
    }
  }

  function onReset(opts?: { noReactionWhenServer?: boolean }) {
    setQ("");
    setQNorm("");

    if (opts?.noReactionWhenServer && mode !== "client") return;

    abortRef.current?.abort();
    abortRef.current = null;

    allCacheRef.current = [];
    setMode("server");
    setOffset(0);
  }

  return {
    mode,
    q,
    setQ,
    qNorm,
    offset,
    setOffset,
    current,
    total,
    loading,

    items: viewItems,

    onSearch,
    onReset,

    // 필요하면 외부에서 쓰도록 노출
    loadServerPage,
  };
}
