import type { ManagementHeaderProps } from "@/myPlant/types/myPlantManagement";

export default function ManagementHeader({ keyword, onKeywordChange, onSearch, onOpenAdd }: ManagementHeaderProps) {
    return (
        <div className="d-flex justify-content-end align-items-center mb-3">
            <div className="input-group me-3" style={{ maxWidth: 500 }}>
                <input
                    type="text"
                    className="form-control"
                    id="search"
                    placeholder="나의 식물 이름 검색"
                    value={keyword}
                    onChange={(e) => onKeywordChange(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") onSearch();
                    }}
                />
                <button className="btn btn-outline-secondary" id="searchBtn" onClick={onSearch} type="button">
                    <i className="bi bi-search" />
                </button>
            </div>

            <button className="btn btn-success fw-bold" id="openAddModal" type="button" onClick={onOpenAdd}>
                나의 식물 등록
            </button>
        </div>
    );
}
