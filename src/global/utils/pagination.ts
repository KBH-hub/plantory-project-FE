export type PaginatorLabels = { first: string; prev: string; next: string; last: string };

export type CreatePaginatorOptions = {
  container: HTMLElement;
  current?: number;
  totalItems?: number | null;
  pageSize?: number;
  totalPages?: number | null;
  windowSize?: number;
  modeWhenUnknown?: "next-only";
  labels?: PaginatorLabels;
  onChange?: (page: number) => void;
};

export type PaginatorInstance = {
  update: (params?: Partial<Omit<CreatePaginatorOptions, "container" | "onChange">>) => void;
};

export function createPaginator({
  container,
  current = 1,
  totalItems = null,
  pageSize = 10,
  totalPages = null,
  windowSize = 5,
  modeWhenUnknown = "next-only",
  labels = { first: "«", prev: "‹", next: "›", last: "»" },
  onChange = () => {},
}: CreatePaginatorOptions): PaginatorInstance {
  if (!container) throw new Error("container is required");

  function calcTotalPages() {
    if (Number.isFinite(totalPages) && (totalPages as number) > 0) return Math.max(1, Math.floor(totalPages as number));
    if (Number.isFinite(totalItems) && (totalItems as number) >= 0 && Number.isFinite(pageSize) && pageSize > 0) {
      return Math.max(1, Math.ceil((totalItems as number) / pageSize));
    }
    return null;
  }

  function makeItem(
    label: string,
    page: number | null,
    { disabled = false, active = false, aria = null as string | null } = {}
  ) {
    const li = document.createElement("li");
    li.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    if (aria) a.setAttribute("aria-label", aria);
    a.textContent = label;

    a.addEventListener("click", (ev) => {
      ev.preventDefault();
      if (disabled || active) return;
      if (typeof page === "number" && page >= 1) onChange(page);
    });

    li.appendChild(a);
    return li;
  }

  function render() {
    const totalP = calcTotalPages();
    container.innerHTML = "";

    if (totalP == null) {
      if (modeWhenUnknown === "next-only") {
        container.appendChild(makeItem(labels.first, null, { disabled: true, aria: "첫 페이지" }));
        container.appendChild(makeItem(labels.prev, null, { disabled: true, aria: "이전 페이지" }));
        container.appendChild(makeItem(labels.next, current + 1, { aria: "다음 페이지" }));
        container.appendChild(makeItem(labels.last, null, { disabled: true, aria: "마지막 페이지" }));
      }
      return;
    }

    const curr = Math.max(1, Math.min(current, totalP));
    const isFirst = curr === 1;
    const isLast = curr >= totalP;

    container.appendChild(makeItem(labels.first, 1, { disabled: isFirst, aria: "첫 페이지" }));
    container.appendChild(makeItem(labels.prev, curr - 1, { disabled: isFirst, aria: "이전 페이지" }));

    const blockStart = Math.floor((curr - 1) / windowSize) * windowSize + 1;
    const blockEnd = Math.min(blockStart + windowSize - 1, totalP);
    for (let p = blockStart; p <= blockEnd; p++) {
      container.appendChild(makeItem(String(p), p, { active: p === curr }));
    }

    container.appendChild(makeItem(labels.next, curr + 1, { disabled: isLast, aria: "다음 페이지" }));
    container.appendChild(makeItem(labels.last, totalP, { disabled: isLast, aria: "마지막 페이지" }));
  }

  function update(params: Partial<Omit<CreatePaginatorOptions, "container" | "onChange">> = {}) {
    if ("current" in params) current = Number(params.current) || 1;
    if ("totalItems" in params) totalItems = params.totalItems ?? null;
    if ("pageSize" in params && typeof params.pageSize === "number") pageSize = params.pageSize;
    if ("totalPages" in params) totalPages = params.totalPages ?? null;
    if ("windowSize" in params && typeof params.windowSize === "number") windowSize = params.windowSize;
    if ("modeWhenUnknown" in params && params.modeWhenUnknown) modeWhenUnknown = params.modeWhenUnknown;
    render();
  }

  render();
  return { update };
}
