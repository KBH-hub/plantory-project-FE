import { useEffect, useRef } from "react";
import { createPaginator } from "@/global/utils/pagination";
import type { paginationArgs, PaginatorUpdateArgs } from "@/global/types/paginationType";

export function usePaginator({ containerRef, current, totalItems, pageSize, onChange }: paginationArgs) {
  const paginatorRef = useRef<{ update: (p?: PaginatorUpdateArgs) => void } | null>(null);
  const onChangeRef = useRef(onChange);
  const containerNodeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerChanged = containerNodeRef.current !== container;

    if (!paginatorRef.current || containerChanged) {
      container.innerHTML = "";
      containerNodeRef.current = container;

      paginatorRef.current = createPaginator({
        container,
        current,
        totalItems,
        pageSize,
        windowSize: 5,
        modeWhenUnknown: "next-only",
        onChange: (page: number) => onChangeRef.current(page),
      });

      return () => {
        if (containerNodeRef.current === container) {
          container.innerHTML = "";
          containerNodeRef.current = null;
        }
        paginatorRef.current = null;
      };
    }

    paginatorRef.current.update({
      current,
      totalItems,
      pageSize,
    });
  }, [containerRef, current, totalItems, pageSize]);
}
