import type { DateRange } from "@/admin/types/weightManagementType";

type Props = {
  title: string;

  searchInput: string;
  onChangeSearchInput: (v: string) => void;
  onSearch: () => void;

  range: DateRange;
  onChangeRange: (next: DateRange) => void;
};

export default function ListControlPanel({
  title,
  searchInput,
  onChangeSearchInput,
  onSearch,
  range,
  onChangeRange,
}: Props) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h5 className="fw-bold mb-0">{title}</h5>

      <div className="d-flex align-items-center gap-2">
        <div className="input-group" style={{ width: 320 }}>
          <input
            value={searchInput}
            onChange={(e) => onChangeSearchInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            type="text"
            className="form-control px-3"
            placeholder="아이디로 검색"
          />
          <button onClick={onSearch} className="btn btn-dark px-3" type="button">
            <i className="bi bi-search" />
          </button>
        </div>

        <select
          value={range}
          onChange={(e) => onChangeRange(e.target.value as DateRange)}
          className="form-select form-select-sm"
          style={{ width: 130 }}
        >
          <option value="30D">최근 30일</option>
          <option value="60D">최근 60일</option>
          <option value="90D">최근 90일</option>
          <option value="ALL">전체</option>
        </select>
      </div>
    </div>
  );
}
