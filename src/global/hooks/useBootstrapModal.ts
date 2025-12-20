import { useCallback, useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    bootstrap?: any;
  }
}

type MaybePromise<T> = T | Promise<T>;

function getModalInstance(el: HTMLElement) {
  const bs = window.bootstrap;
  if (!bs?.Modal) return null;
  return bs.Modal.getInstance(el) || new bs.Modal(el);
}

function isShown(el: HTMLElement) {
  return el.classList.contains("show");
}

export function useBootstrapModal(modalId: string) {
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    elRef.current = document.getElementById(modalId) as HTMLElement | null;
  }, [modalId]);

  const getEl = useCallback(() => {
    if (elRef.current) return elRef.current;
    elRef.current = document.getElementById(modalId) as HTMLElement | null;
    return elRef.current;
  }, [modalId]);

  const getInstance = useCallback(() => {
    const el = getEl();
    if (!el) return null;
    return getModalInstance(el);
  }, [getEl]);

  const open = useCallback(() => {
    const inst = getInstance();
    inst?.show();
  }, [getInstance]);

  const close = useCallback(() => {
    const inst = getInstance();
    inst?.hide();
  }, [getInstance]);

  const shown = useCallback(() => {
    const el = getEl();
    return el ? isShown(el) : false;
  }, [getEl]);

  const withHidden = useCallback(
    async <T,>(job: () => MaybePromise<T>, options?: { restore?: boolean }) => {
      const el = getEl();
      if (!el) return await job();

      const inst = getModalInstance(el);
      const wasOpen = isShown(el);
      const restore = options?.restore ?? true;

      if (wasOpen) inst?.hide();

      try {
        return await job();
      } finally {
        if (wasOpen && restore) inst?.show();
      }
    },
    [getEl]
  );

  const on = useCallback(
    (eventName: string, handler: (e: any) => void) => {
      const el = getEl();
      if (!el) return () => {};
      const h = handler as any;
      el.addEventListener(eventName, h);
      return () => el.removeEventListener(eventName, h);
    },
    [getEl]
  );

  return useMemo(
    () => ({
      modalId,
      getEl,
      getInstance,
      open,
      close,
      shown,
      withHidden,
      on,
    }),
    [modalId, getEl, getInstance, open, close, shown, withHidden, on]
  );
}
