import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSharingReviewInfo } from "@/community/sharing/services/updateReviewApi";
import { ReviewInfoResponse} from "@/community/sharing/types/updateReviewType";
import { showModal } from "@/global/utils/showModal";

export function useUpdateReview(sharingId?: number) {
  const navigate = useNavigate();

  const [info, setInfo] = useState<ReviewInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sharingId) return;

    getSharingReviewInfo(sharingId)
      .then(setInfo)
      .catch(() => {
        showModal.alert("후기 작성 권한이 없습니다.", {
          callback: () => navigate(`/sharing/${sharingId}`),
        });
      })
      .finally(() => setLoading(false));
  }, [sharingId, navigate]);

  return {
    info,
    loading,
  };
}