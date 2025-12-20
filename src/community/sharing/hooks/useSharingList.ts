import { useEffect, useState } from "react";
import { getSharingList, getPopularSharingList, getInterestCount } from "@/community/sharing/services/sharingListApi";
import { SharingCardListResponse, SharingSearchRequest } from "@/community/sharing/types/sharingList";

export function useSharingList() {
  const [list, setList] = useState<SharingCardListResponse[]>([]);
  const [popular, setPopular] = useState<SharingCardListResponse[]>([]);
  const [interestCount, setInterestCount] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const [offset, setOffset] = useState(0);
  const limit = 12;
  const [isLastPage, setIsLastPage] = useState(false);

  const loadSharing = (append = false, customOffset?: number) => {
    const realOffset = customOffset ?? offset;

    const params: SharingSearchRequest = {
      keyword,
      userAddress: userAddress || undefined,
      limit,
      offset: realOffset,
    };

    getSharingList(params).then((data) => {
      setList((prev) => (append ? [...prev, ...data] : data));
      setIsLastPage(data.length < limit);
    });
  };

  const loadMore = () => {
    const next = offset + limit;
    setOffset(next);
    loadSharing(true, next);
  };

  useEffect(() => {
    getInterestCount().then(setInterestCount);
  }, []);

    useEffect(() => {
    loadSharing(false, 0);

    getPopularSharingList({
        userAddress: userAddress || undefined,
    }).then(setPopular);
    }, [keyword, userAddress]);

  return {
    list,
    popular,
    interestCount,
    keyword,
    setKeyword,
    userAddress,
    setUserAddress,
    isLastPage,
    loadMore,
  };
}
