import { useEffect, useMemo, useRef, useState } from "react";
import { usePaginator } from "@/global/hooks/usePaginator";
import { fetchMembers } from "@/admin/services/memberManagementApi";
import type { MemberRow } from "../types/memberManagementType";

export function useMemberManagement() {
  const limit = 10;

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<MemberRow[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

  const pagerRef = useRef<HTMLUListElement | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { list, totalCount } = await fetchMembers({ keyword, offset, limit });
      setItems(list);
      setTotal(totalCount);
    } catch (e) {
      console.error(e);
      setItems([]);
      setTotal(0);
      setErrorMsg("회원 데이터를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [keyword, offset]);

  const onSearch = () => {
    setKeyword(keywordInput.trim());
    setOffset(0);
  };

  usePaginator({
    containerRef: pagerRef,
    current: currentPage,
    totalItems: total,
    pageSize: limit,
    onChange: (page) => setOffset((page - 1) * limit),
  });

  return {
    keywordInput,
    setKeywordInput,
    items,
    total,
    loading,
    errorMsg,
    pagerRef,
    onSearch,
  };
}
