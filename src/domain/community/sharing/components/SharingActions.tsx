import { useAuthStore } from "@/global/stores/useAuthStore";
import { SharingDetailResponse } from "../types/readSharing";

interface Props {
  data: SharingDetailResponse;
}

function SharingActions({ data }: Props) {
  const { user, isLogin } = useAuthStore();

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
          <button className="btn btn-outline-secondary">관심 ♡</button>
          <button className="btn btn-success">쪽지 보내기</button>
        </>
      )}
    </div>
  );
}

export default SharingActions;
