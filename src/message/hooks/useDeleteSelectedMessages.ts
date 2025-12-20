import { useCallback } from "react";
import type { BoxType } from "@/message/enums/messageEnums";
import { showModal } from "@/global/utils/showModal";

interface UseDeleteSelectedMessagesParams {
  boxType: BoxType;
  selectedIds: number[];
  onSuccess: () => void;
  deleter: (boxType: BoxType, ids: number[]) => Promise<void>;
}

export function useDeleteSelectedMessages({
  boxType,
  selectedIds,
  onSuccess,
  deleter,
}: UseDeleteSelectedMessagesParams) {
  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;

    const ok = await showModal.confirm(`선택한 ${selectedIds.length}건을 삭제하시겠습니까?`);
    if (!ok) return;

    try {
      await deleter(boxType, selectedIds);
      onSuccess();
      showModal.alert(`삭제되었습니다`);
    } catch (e) {
      console.error(e);
      alert("삭제 실패");
    }
  }, [boxType, selectedIds, deleter, onSuccess]);

  return { handleDeleteSelected };
}