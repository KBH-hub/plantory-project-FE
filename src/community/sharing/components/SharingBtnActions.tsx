import { useAuthStore } from "@/global/stores/useAuthStore";
import { SharingDetailResponse } from "@/community/sharing/types/readSharing";
import { useInterestToggle } from "@/community/sharing/hooks/useInterestToggle";
import { Link, useNavigate } from "react-router-dom";
import { deleteSharing } from "@/community/sharing/services/readSharingApi";
import { showModal } from "@/global/utils/showModal";

interface Props {
  data: SharingDetailResponse;
}

function SharingBtnActions({ data }: Props) {
  const { user, isLogin } = useAuthStore();
  const navigate = useNavigate();

  const { interested, interestCount, toggle } = useInterestToggle(
    data.interested,
    data.interestNum,
    data.sharingId
  );

  if (!isLogin || !user) return null;

  const isWriter = user.memberId === data.memberId;

  return (
    <div className="d-flex justify-content-end gap-2">
      {isWriter ? (
        <>
          <Link to={`/sharing/${data.sharingId}/edit`} className="btn btn-primary px-4">
          수정
          </Link>
          <button
            className="btn btn-danger px-4"
            onClick={async () => {
              const ok = await showModal.confirm("정말 삭제하시겠습니까?");
              if (!ok) return;
              await deleteSharing(data.sharingId);
              showModal.alert("삭제되었습니다.", { callback: () => navigate("/sharingList"),});
            }}>
            삭제
          </button>

          <button className="btn btn-success px-4">나눔 완료</button>
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

          <button className="btn btn-success px-4">쪽지 보내기</button>
        </>
      )}
    </div>
  );
}

export default SharingBtnActions;
