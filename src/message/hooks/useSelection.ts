import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type IdItem = { messageId: number };

interface UseSelectionParams<messages extends IdItem> {
  items: messages[];
  resetDeps?: readonly unknown[];
}

export function useSelection<T extends IdItem>({ items, resetDeps = [] }: UseSelectionParams<T>) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const checkAllRef = useRef<HTMLInputElement | null>(null);

  const itemIds = useMemo(() => items.map((it) => it.messageId), [items]);

  const allChecked = items.length > 0 && selectedIds.length === items.length;
  const someChecked = selectedIds.length > 0 && selectedIds.length < items.length;

  const clear = useCallback(() => setSelectedIds([]), []);

  const toggleRow = useCallback((id: number, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return prev.includes(id) ? prev : [...prev, id];
      return prev.filter((v) => v !== id);
    });
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      if (!checked) return setSelectedIds([]);
      setSelectedIds(itemIds);
    },
    [itemIds]
  );

  useEffect(() => {
    if (!checkAllRef.current) return;
    checkAllRef.current.indeterminate = someChecked;
  }, [someChecked]);

  useEffect(() => {
    setSelectedIds([]);
  }, resetDeps);

  return {
    selectedIds,
    setSelectedIds,
    checkAllRef,
    allChecked,
    someChecked,
    clear,
    toggleRow,
    toggleAll,
  };
}