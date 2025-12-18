import { useEffect } from "react";

export function useIndeterminate(
  ref: React.RefObject<HTMLInputElement | null>,
  indeterminate: boolean
) {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.indeterminate = indeterminate;
  }, [ref, indeterminate]);
}