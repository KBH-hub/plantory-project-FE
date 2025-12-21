import { useEffect, useRef } from "react";
import { createPaginator } from "@/global/utils/pagination";
import type { paginationArgs, PaginatorUpdateArgs } from "@/global/types/pagination";

export function usePaginator({ containerRef, current, totalItems, pageSize, onChange }: paginationArgs) {
    const paginatorRef = useRef<{ update: (p?: PaginatorUpdateArgs) => void } | null>(null);
    const onChangeRef = useRef(onChange);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    paginatorRef.current = createPaginator({
      container,
      current,
      totalItems,
      pageSize,
      windowSize: 5,
      modeWhenUnknown: "next-only",
      onChange,
    });

    return () => {
      container.innerHTML = "";
      paginatorRef.current = null;
    };
  }, [containerRef, current, totalItems, pageSize, onChange]);
}
