import { useAuthStore } from "@/global/stores/useAuthStore";
import { SharingDetailResponse } from "../types/readSharing";
import { useInterestToggle } from "@/community/sharing/hooks/useReadSharing";

interface Props {
  data: SharingDetailResponse;
}

function SharingActions({ data }: Props) {
  const { user, isLogin } = useAuthStore();

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
          <button className="btn btn-primary">수정</button>
          <button className="btn btn-danger">삭제</button>
          <button className="btn btn-success">나눔 완료</button>
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

          <button className="btn btn-success">쪽지 보내기</button>
        </>
      )}
    </div>
  );
}

export default SharingActions;
