import { useState } from "react";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { SharingDetailResponse } from "@/community/sharing/types/readSharing";
import { useInterestToggle } from "@/community/sharing/hooks/useInterestToggle";
import { Link, useNavigate } from "react-router-dom";
import { deleteSharing } from "@/community/sharing/services/readSharingApi";
import { showModal } from "@/global/utils/showModal";
import CompleteSharingModal from "./CompleteSharingModal";
import { SharingPartner } from "../types/completeSharing";
import { getSharingPartners, completeSharing } from "@/community/sharing/services/completeSharingApi";

interface Props {
  data: SharingDetailResponse;
}

type Step = "select" | "confirm" | "result";

function SharingBtnActions({ data }: Props) {
  const { user, isLogin } = useAuthStore();
  const navigate = useNavigate();
  
  const { interested, interestCount, toggle } = useInterestToggle(
    data.interested,
    data.interestNum,
    data.sharingId
  );
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("select");
  const [partners, setPartners] = useState<SharingPartner[]>([]);
  const [selected, setSelected] = useState<SharingPartner | null>(null);
  const [completed, setCompleted] = useState(data.status === "true");

  if (!isLogin || !user) return null;

  const isWriter = user.memberId === data.memberId;
  const isCompleted = completed


  const openCompleteModal = async () => {
    try {
      const list = await getSharingPartners(data.sharingId, user.memberId);
      setPartners(list);
      setSelected(null);
      setStep("select");
      setOpen(true);
    } catch (e) {
      console.error(e);
      showModal.alert("대화 상대를 불러오지 못했습니다.");
    }
  };

  const handleComplete = async () => {
    if (!selected) return;

    try {
      await completeSharing(data.sharingId, selected.memberId);
      setStep("result");
      setCompleted(true); 
    } catch (e) {
      console.error(e);
      showModal.alert("나눔 완료 처리 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    const ok = await showModal.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    await deleteSharing(data.sharingId);
    showModal.alert("삭제되었습니다.", {
      callback: () => navigate("/sharingList"),
    });
  };


  return (
    <>
      <div className="d-flex justify-content-end gap-2">
        {isWriter ? (
          <>
            <Link to={`/sharing/${data.sharingId}/edit`} className="btn btn-primary px-4">
              수정
            </Link>

            <button className="btn btn-danger px-4" onClick={handleDelete}>
              삭제
            </button>

            {!isCompleted ? (
              <button className="btn btn-success px-4" onClick={openCompleteModal}>
                나눔 완료
              </button>
            ) : (
              <Link to={`/sharing/${data.sharingId}/review`} className="btn btn-success">
                후기 작성하기
              </Link>
            )}
          </>
        ) : (
          <>
            <button
              className={`btn px-4 ${
                interested ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={toggle}
            >
              <span>{interested ? "관심♥" : "관심♡"}</span>
              <span className="ms-1">({interestCount})</span>
            </button>

            <button className="btn btn-success px-4">
              쪽지 보내기
            </button>
          </>
        )}
    
      </div>

      {isWriter && (
        <CompleteSharingModal
          open={open}
          step={step}
          partners={partners}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setOpen(false)}
          onBack={() => setStep("select")}
          onNext={() => setStep("confirm")}
          onComplete={handleComplete}
          onGoReview={() =>
            navigate(`/sharing/${data.sharingId}/review`)
          }
        />
      )}
    </>
  );
}

export default SharingBtnActions;