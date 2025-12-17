import { useEffect, useRef } from "react";
import { createPaginator } from "@/global/utils/pagination";
import type { paginationArgs, PaginatorUpdateArgs } from "@/domain/message/types/message";


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
  }, [containerRef, onChange]); // 최초 1회 생성

  useEffect(() => {
    if (!paginatorRef.current) return;
    paginatorRef.current.update({ current, totalItems, pageSize });
  }, [current, totalItems, pageSize]);
}