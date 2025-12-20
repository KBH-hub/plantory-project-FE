import { useEffect, useRef } from "react";
import { createPaginator } from "@/global/utils/pagination";
import type { paginationArgs, PaginatorUpdateArgs } from "@/global/types/pagination";


export function usePaginator({ containerRef, current, totalItems, pageSize, onChange }: paginationArgs) {
  const paginatorRef = useRef<{ update: (p?: PaginatorUpdateArgs) => void } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (paginatorRef.current) return;

    paginatorRef.current = createPaginator({
      container: containerRef.current,
      current,
      totalItems,
      pageSize,
      windowSize: 5,
      modeWhenUnknown: "next-only",
      onChange,
    });
  }, [containerRef, onChange]);

  useEffect(() => {
    if (!paginatorRef.current) return;
    paginatorRef.current.update({ current, totalItems, pageSize });
  }, [current, totalItems, pageSize]);
}