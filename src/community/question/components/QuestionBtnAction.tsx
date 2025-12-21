import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/global/stores/useAuthStore";
import BtnAction from "@/community/components/BtnAction";
import MessageRegisterModal from "@/global/components/MessageRegisterModal";
import { useRegisterMessage } from "@/message/hooks/useRegisterMessage";
import { showModal } from "@/global/utils/showModal";
import { deleteQuestion } from "@/community/question/services/readQuestionApi"
import { ReplyForm } from "@/message/types/message";
import { QuestionDetailResponse } from "@/community/question/types/readQuestion"

interface Props {
  data: QuestionDetailResponse;
}

function QuestionBtnAction({ data }: Props) {
  const { user, isLogin } = useAuthStore();
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    const ok = await showModal.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    await deleteQuestion(data.questionId);
    showModal.alert("삭제되었습니다.", {
      callback: () => navigate("/questionList"),
    });
  };

  const handleSubmitMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await send({
      receiverId: data.memberId,
      title: reply.title,
      content: reply.content,
      targetType: "QUESTION",
      targetId: data.questionId,
    });
  };

  return (
    <>
      {isWriter ? (
        <BtnAction editLink={`/updateQuestion/${data.questionId}`} onDelete={handleDelete} />
      ) : (
        <BtnAction>
          <button className="btn btn-success px-4" onClick={() => setMessageOpen(true)}>
            쪽지 보내기
          </button>
        </BtnAction>
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

export default QuestionBtnAction;
