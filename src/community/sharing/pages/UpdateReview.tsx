import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { registerSharingReview } from "@/community/sharing/services/updateReviewApi";
import { ReviewRequest } from "@/community/sharing/types/updateReviewType";
import { formatDate } from "@/global/utils/date";
import { showModal } from "@/global/utils/showModal";
import { useUpdateReview } from "@/community/sharing/hooks/useUpdateReview";

function UpdateReview() {
  const { sharingId } = useParams<{ sharingId: string }>();
  const navigate = useNavigate();

  const numericSharingId = Number(sharingId);

  const { info, loading } = useUpdateReview(numericSharingId);

  const [manner, setManner] = useState<number | null>(null);
  const [reShare, setReShare] = useState<number | null>(null);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);

  if (loading || !info) return null;


  const handleSubmit = async () => {
    if (!manner || !reShare) {
      showModal.alert("필수 항목을 선택해주세요.");
      return;
    }

    const review: ReviewRequest = {
      manner,
      reShare,
      satisfaction, 
    };

    try {
      await registerSharingReview(numericSharingId, review);

      showModal.alert("후기가 등록되었습니다.", {
        callback: () => navigate(`/sharing/${numericSharingId}`),
      });
    } catch (err) {
      console.error(err);
      showModal.alert("후기 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-light" style={{ overflowX: "auto", fontFamily: "Noto Sans KR, sans-serif" }} >
      <div className="mx-auto" style={{ width: "1470px", padding: "16px" }}>
        <h4 className="fw-bold mb-4">후기 작성하기</h4>
        <hr />

        <div className="mb-4">
          <p className="fw-bold">
            {info.partnerNickname} 님과의 나눔 후기를 작성해주세요!
          </p>

          <p className="text-muted">
            관련글:{" "}
            <span className="fw-bold text-dark">{info.title}</span>{" "}
            (<span className="text-secondary">
              {formatDate(info.createdAt)}
            </span>)
          </p>
        </div>

        <hr className="my-4" />

        <div className="mb-4">
          <h6 className="fw-bold">매너 지수</h6>
          <p className="text-muted">
            나눔 과정에서 시간약속과 대화태도는 어땠나요?
          </p>

          <div className="d-flex gap-4">
            {[1, 2, 3].map((v) => (
              <div className="form-check" key={v}>
                <input
                  className="form-check-input"
                  type="radio"
                  checked={manner === v}
                  onChange={() => setManner(v)}
                />
                <label className="form-check-label">
                  {v === 1 ? "만족" : v === 2 ? "보통" : "불만족"}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h6 className="fw-bold">재나눔 희망</h6>

          <div className="d-flex gap-4">
            {[1, 2].map((v) => (
              <div className="form-check" key={v}>
                <input
                  className="form-check-input"
                  type="radio"
                  checked={reShare === v}
                  onChange={() => setReShare(v)}
                />
                <label className="form-check-label">
                  {v === 1 ? "희망해요" : "희망하지 않아요"}
                </label>
              </div>
            ))}
          </div>
        </div>

        {info.reviewerType === "RECEIVER" && (
          <div className="mb-5">
            <h6 className="fw-bold">만족 지수</h6>
            <p className="text-muted">
              식물 상태 및 관리방법 안내가 잘 이루어졌나요?
            </p>

            <div className="d-flex gap-4">
              {[1, 2, 3].map((v) => (
                <div className="form-check" key={v}>
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={satisfaction === v}
                    onChange={() => setSatisfaction(v)}
                  />
                  <label className="form-check-label">
                    {v === 1 ? "만족" : v === 2 ? "보통" : "불만족"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-3" onClick={() => navigate(-1)}>
            취소
          </button>
          <button className="btn btn-success" onClick={handleSubmit}>
            후기 작성
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateReview;
