import SharingCard from "@/global/components/SharingCard";
import { mapToSharingCard } from "@/global/utils/mapToSharingCard";
import { useProfileSharingHistory } from "@/member/hooks/useProfileSharingHistory";

function ProfileSharingHistory() {
  const {
    tab,
    status,
    items,
    paginationRef,
    setTab,
    search,
    changeStatus,
  } = useProfileSharingHistory();

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">나눔 내역</h3>
        <p className="text-muted small mb-0">
          나의 식물 &gt; 내프로필 &gt; 나눔 내역
        </p>
      </div>

      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === "MY" ? "active" : ""}`} onClick={() => setTab("MY")}>
            내가 올린 나눔 글
          </button>
        </li>
        <li className="nav-item ms-2">
          <button className={`nav-link ${tab === "RECEIVED" ? "active" : ""}`} onClick={() => setTab("RECEIVED")}>
            분양 받은 나눔 글
          </button>
        </li>
      </ul>

      <div className="d-flex justify-content-end gap-2 mb-3">
        <input
          className="form-control w-auto"
          placeholder="제목으로 검색"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              search((e.target as HTMLInputElement).value);
            }
          }}
        />

        <select
          className="form-select w-auto"
          value={status}
          onChange={(e) => changeStatus(e.target.value)}
        >
          <option value="false">나눔중</option>
          <option value="true">나눔완료</option>
        </select>
      </div>

      <div className="row g-3">
        {items.length === 0 ? (
          <div className="text-center text-muted py-5">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          items.map((item) => (
            <SharingCard
              key={item.sharingId}
              item={mapToSharingCard(item)}
            />
          ))
        )}
      </div>

      <nav className="mt-4">
        <ul
          ref={paginationRef}
          className="pagination pagination-sm justify-content-center mb-0"
        />
      </nav>
    </div>
  );
}

export default ProfileSharingHistory;
