import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";
import { useInterestToggle } from "@/community/sharing/hooks/useInterestToggle";
import { deleteSharing } from "@/community/sharing/services/readSharingApi";
import { getSharingPartners, completeSharing } from "@/community/sharing/services/completeSharingApi";
import { showModal } from "@/global/utils/showModal";
import BtnAction from "@/community/components/BtnAction";
import CompleteSharingModal from "./CompleteSharingModal";
import MessageRegisterModal from "@/global/components/MessageRegisterModal";
import { SharingDetailResponse } from "@/community/sharing/types/readSharingType";
import { SharingPartner } from "@/community/sharing/types/completeSharingType";
import { ReplyForm } from "@/message/types/messageType";
import { useRegisterMessage } from "@/message/hooks/useRegisterMessage";


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

  const [messageOpen, setMessageOpen] = useState(false);
  const [reply, setReply] = useState<ReplyForm>({
    to: data.nickname,
    post: data.title,
    title: "",
    content: "",
  });

    const { isSending, send } = useRegisterMessage({
    confirm: showModal.confirm,
    alert: showModal.alert,
    onSuccess: () => {
      setMessageOpen(false);
      setReply((prev) => ({ ...prev, title: "", content: "" }));
    },
  });

  if (!isLogin || !user) return null;

  const isWriter = user.memberId === data.memberId;
  const isReceiver = user.memberId === data.targetMemberId;

  const isReviewWritten =
    (isWriter && data.reviewFlag) ||
    (isReceiver && data.receiverReviewFlag);

  const canWriteReview =
    data.status === "true" &&
    (isWriter || isReceiver) &&
    !isReviewWritten;

  const handleDelete = async () => {
    const ok = await showModal.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    await deleteSharing(data.sharingId);
    showModal.alert("삭제되었습니다.", { callback: () => navigate("/sharingList") });
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

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  await send({
    receiverId: data.memberId,
    title: reply.title,
    content: reply.content,
    targetType: "SHARING",
    targetId: data.sharingId,
  });
};

  return (
    <>
      {isWriter ? (
        <BtnAction editLink={`/sharing/${data.sharingId}/edit`} onDelete={handleDelete}>
          {!completed && <button className="btn btn-success px-4" onClick={openCompleteModal}>나눔 완료</button>}
          {completed && canWriteReview && <Link to={`/sharing/${data.sharingId}/review`} className="btn btn-success">후기 작성하기</Link>}
          {completed && isReviewWritten && <button className="btn btn-outline-secondary" disabled>✔ 후기 작성 완료</button>}
        </BtnAction>
      ) : (
        <BtnAction>
          <button className={`btn px-4 ${interested ? "btn-danger" : "btn-outline-secondary"}`} onClick={toggle}>
            <span>{interested ? "관심♥" : "관심♡"}</span>
            <span className="ms-1">{interestCount}</span>
          </button>
          <button className="btn btn-success px-4" onClick={() => setMessageOpen(true)}>쪽지 보내기</button>
          {canWriteReview && <Link to={`/sharing/${data.sharingId}/review`} className="btn btn-success px-4">후기 작성하기</Link>}
          {isReviewWritten && <button className="btn btn-outline-secondary px-4" disabled>✔ 후기 작성 완료</button>}
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
          onGoReview={() => navigate(`/sharing/${data.sharingId}/review`)}
        />
      )}

      <MessageRegisterModal
        isOpen={messageOpen}
        reply={reply}
        isSending={isSending}
        onClose={() => setMessageOpen(false)}
        onSubmit={handleSubmitMessage}
        onChangeTitle={(title) => setReply({ ...reply, title })}
        onChangeContent={(content) => setReply({ ...reply, content })}
      />
    </>
  );
}

export default SharingBtnAction;
