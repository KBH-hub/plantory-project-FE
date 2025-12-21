import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { useInterestToggle } from "@/community/sharing/hooks/useInterestToggle";
import { deleteSharing } from "@/community/sharing/services/readSharingApi";
import { getSharingPartners, completeSharing } from "@/community/sharing/services/completeSharingApi";
import { showModal } from "@/global/utils/showModal";
import BtnAction from "@/community/components/BtnAction";
import CompleteSharingModal from "./CompleteSharingModal";
import { SharingDetailResponse } from "@/community/sharing/types/readSharing";
import { SharingPartner } from "../types/completeSharing";

interface Props {
  data: SharingDetailResponse;
}

type Step = "select" | "confirm" | "result";

function SharingBtnAction({ data }: Props) {
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

  const handleDelete = async () => {
    const ok = await showModal.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    await deleteSharing(data.sharingId);
    showModal.alert("삭제되었습니다.", {
      callback: () => navigate("/sharingList"),
    });
  };

  const openCompleteModal = async () => {
    const list = await getSharingPartners(data.sharingId, user.memberId);
    setPartners(list);
    setSelected(null);
    setStep("select");
    setOpen(true);
  };

  const handleComplete = async () => {
    if (!selected) return;

    await completeSharing(data.sharingId, selected.memberId);
    setCompleted(true);
    setStep("result");
  };

  return (
    <>
      {isWriter ? (
        <BtnAction
          editLink={`/sharing/${data.sharingId}/edit`}
          onDelete={handleDelete}
        >
          {!completed ? (
            <button className="btn btn-success px-4" onClick={openCompleteModal}>
              나눔 완료
            </button>
          ) : (
            <Link to={`/sharing/${data.sharingId}/review`} className="btn btn-success">
              후기 작성하기
            </Link>
          )}
        </BtnAction>
      ) : (
        <BtnAction>
          <button className={`btn px-4 ${
              interested ? "btn-danger" : "btn-outline-secondary"
            }`}
            onClick={toggle}
          >
            관심 {interestCount}
          </button>

          <button className="btn btn-success px-4">
            쪽지 보내기
          </button>
        </BtnAction>
      )}

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

export default SharingBtnAction;
