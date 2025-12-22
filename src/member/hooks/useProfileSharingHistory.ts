import { useEffect, useRef, useState } from "react";
import { ProfileSharingHistoryResponse, ProfileSharingTab } from "@/member/types/sharingHistoryType";
import { getMySharingHistory, getReceivedSharingHistory } from "@/member/services/SharingHistoryApi";
import { usePaginator } from "@/global/hooks/usePaginator";

export function useProfileSharingHistory() {
  const [tab, setTab] = useState<ProfileSharingTab>("MY");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("false");
  const [items, setItems] = useState<ProfileSharingHistoryResponse[]>([]);
  const [offset, setOffset] = useState(0);

  const limit = 9;
  const [total, setTotal] = useState(0);

  const paginationRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const params = { keyword, status, offset, limit };

      const data =
        tab === "MY" ? await getMySharingHistory(params) : await getReceivedSharingHistory(params);
      setItems(data);
      setTotal(data[0]?.totalCount ?? 0);
    };

    fetchData();
  }, [tab, keyword, status, offset]);

  usePaginator({
    containerRef: paginationRef,
    current: offset / limit + 1,
    totalItems: total,
    pageSize: limit,
    onChange: (page) => {
      setOffset((page - 1) * limit);
    },
  });

  return {
    tab,
    keyword,
    status,
    items,
    paginationRef,
    setTab: (next: ProfileSharingTab) => {
      setTab(next);
      setOffset(0);
    },
    search: (value: string) => {
      setKeyword(value);
      setOffset(0);
    },
    changeStatus: (value: string) => {
      setStatus(value);
      setOffset(0);
    },
  };
}
