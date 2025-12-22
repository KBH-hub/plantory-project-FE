import { useEffect, useState, useCallback } from "react";
import { getSharingDetail, getSharingComments } from "@/community/sharing/services/readSharingApi";
import { profileApi } from "@/profile/services/profileApi";
import { SharingDetailResponse, SharingCommentResponse } from "@/community/sharing/types/readSharingType";


export function useSharingDetail(sharingId?: number) {
  const [data, setData] = useState<SharingDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [authorProfileImage, setAuthorProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (!sharingId) return;

    const load = async () => {
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

    load();
  }, [sharingId]);

  useEffect(() => {
    if (!data?.memberId) return;

    profileApi
      .getPicture(data.memberId)
      .then((res) => {
        setAuthorProfileImage(res?.imageUrl ?? null);
      })
      .catch(() => {
        setAuthorProfileImage(null);
      });
  }, [data?.memberId]);

  return {
    data,
    loading,
    error,
    authorProfileImage,
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
    reload();
  }, [reload]);

  return { comments, reload };
}