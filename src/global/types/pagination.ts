export interface paginationArgs {
  containerRef: React.RefObject<HTMLUListElement | null>;
  current: number;
  totalItems: number | null;
  pageSize: number;
  onChange: (page: number) => void;
};

export interface PaginatorUpdateArgs {
  current: number;
  totalItems: number | null;
  pageSize: number;
}