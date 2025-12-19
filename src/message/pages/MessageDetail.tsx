import { useNavigate, useParams } from "react-router-dom";
import MessageDetailView from "@/message/components/MessageDetailView";
import { useMessageDetail } from "@/message/hooks/useMessageDetail";
import MessageRegisterModal from "@/global/components/MessageRegisterModal";
import { useRegisterMessage } from "@/message/hooks/useRegisterMessage";
import { useReplyModal } from "@/message/hooks/useReplyModal";


export default function MessageDetail() {
  const { messageId } = useParams();
  const navigate = useNavigate();

  const safeId = (() => {
    const id = Number(messageId);
    return Number.isFinite(id) && id > 0 ? id : null;
  })();

  const { detail, loading } = useMessageDetail(safeId);

  const { isSending, send } = useRegisterMessage();

  const replyModal = useReplyModal({
    detail,
    send,
  });

  if (loading) return <div className="container-xxl py-4">로딩중...</div>;
  if (!detail) return <div className="container-xxl py-4">쪽지를 찾을 수 없습니다.</div>;

  return (
    <>
      <MessageDetailView
        detail={detail}
        onBack={() => navigate('/messageList')}
        onReply={replyModal.open}
      />

      <MessageRegisterModal
        isOpen={replyModal.isOpen}
        reply={replyModal.reply}
        isSending={isSending}
        onClose={replyModal.close}
        onSubmit={replyModal.submit}
        onChangeTitle={replyModal.setTitle}
        onChangeContent={replyModal.setContent}
      />
    </>
  );
}
