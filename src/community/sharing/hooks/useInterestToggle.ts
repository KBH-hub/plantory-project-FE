
import { useEffect, useState } from "react";
import { addInterest, removeInterest, } from "../services/readSharingApi";
import { showModal } from "@/global/utils/showModal";

export function useInterestToggle(
  initialInterested: boolean,
  initialCount: number,
  sharingId: number
) {
  const [interested, setIsInterested] = useState(initialInterested);
  const [interestCount, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsInterested(initialInterested);
    setCount(initialCount);
  }, [initialInterested, initialCount]);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!interested) {
        const res = await addInterest(sharingId);
        if (res) {
          setIsInterested(true);
          setCount((c) => c + 1);
          showModal.alert("관심 등록되었습니다.");
        }
      } else {
        const res = await removeInterest(sharingId);
        if (res) {
          setIsInterested(false);
          setCount((c) => Math.max(0, c - 1));
          showModal.alert("관심 해제되었습니다.")
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { interested, interestCount, toggle, loading };
}