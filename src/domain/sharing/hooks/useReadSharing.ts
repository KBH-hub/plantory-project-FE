import { useEffect, useState, useCallback } from "react";
import { getSharingDetail, getSharingComments } from "../services/readSharingApi";
import { SharingDetailResponse, SharingCommentResponse } from "../types/readSharing";

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
