import { useEffect, useState, useCallback } from "react";
import { getSharingDetail, getSharingComments } from "../services/readSharingApi";
import { SharingDetailResponse, SharingCommentResponse } from "../types/readSharing";
import { addInterest, removeInterest, } from "../services/readSharingApi";
import { showModal } from "@/global/utils/showModal";

export function useSharingDetail(sharingId?: number) {
  const [data, setData] = useState<SharingDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sharingId) return;

    const loadSharingDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getSharingDetail(sharingId);
        setData(res);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    loadSharingDetail();
  }, [sharingId]);

  return {
    data,
    loading,
    error,
  };
}

export function useSharingComments(sharingId?: number) {
  const [comments, setComments] = useState<SharingCommentResponse[]>([]);

  const reload = useCallback(async () => {
    if (!sharingId) return;
    const res = await getSharingComments(sharingId);
    setComments(res);
  }, [sharingId]);

  useEffect(() => {
    if (!sharingId) return;

    const fetch = async () => {
      const res = await getSharingComments(sharingId);
      setComments(res);
    };

    fetch();
  }, [sharingId]);

  return { comments, reload };
}


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
        }
      } else {
        const res = await removeInterest(sharingId);
        if (res) {
          setIsInterested(false);
          setCount((c) => Math.max(0, c - 1));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return { interested, interestCount, toggle, loading };
}