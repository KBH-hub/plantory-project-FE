import { useEffect, useRef, useState } from "react";
import SharingCard from "@/global/components/SharingCard";
import { usePaginator } from "@/global/hooks/usePaginator";
import { mapToSharingCard } from "@/global/utils/mapToSharingCard";
import { getProfileInterestList } from "@/member/services/profileInterestApi";
import { ProfileInterestResponse } from "@/member/types/profileInterestType";
import {ProfileSharingHistoryResponse} from "@/member/types/sharingHistoryType";

function ProfileInterest() {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<ProfileInterestResponse[]>([]);
  const [offset, setOffset] = useState(0);

  const limit = 9;
  const [total, setTotal] = useState(0);

  const paginationRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProfileInterestList({
        keyword,
        offset,
        limit,
      });

      setItems(data);
      setTotal(data[0]?.totalCount ?? 0);
    };

    fetchData();
  }, [keyword, offset]);

  usePaginator({
    containerRef: paginationRef,
    current: offset / limit + 1,
    totalItems: total,
    pageSize: limit,
    onChange: (page) => {
      setOffset((page - 1) * limit);
    },
  });

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-1">관심 나눔글</h3>
        <p className="text-muted small mb-0">
          나의 식물 &gt; 내프로필 &gt; 관심 나눔글
        </p>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <div className="input-group w-auto">
          <input
            type="text"
            className="form-control"
            placeholder="제목으로 검색"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setKeyword((e.target as HTMLInputElement).value);
                setOffset(0);
              }
            }}
          />
          <button
            className="btn btn-dark"
            type="button"
            onClick={(e) => {
              const input =
                e.currentTarget.previousElementSibling as HTMLInputElement;
              setKeyword(input.value);
              setOffset(0);
            }}
          >
            <i className="bi bi-search" />
          </button>
        </div>
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
              item={mapToSharingCard(item as ProfileSharingHistoryResponse)}
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

export default ProfileInterest;
