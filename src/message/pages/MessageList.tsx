import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageListView } from "@/message/components/MessageListView";
import { useMessageList } from "@/message/hooks/useMessageList";
import { usePaginator } from "@/global/hooks/usePaginator";
import { useSelection } from "@/message/hooks/useSelection";
import { useDeleteSelectedMessages } from "@/message/hooks/useDeleteSelectedMessages";
import { BoxType, TargetType } from "@/message/enums/messageEnum";
import { deleteSelectedMessages } from "@/message/services/messageApi";

export default function MessageList() {
  const navigate = useNavigate();

  const [boxType, setBoxType] = useState<BoxType>("RECEIVED");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const [draftTitle, setDraftTitle] = useState("");
  const [draftTargetType, setDraftTargetType] = useState<TargetType | "">("");

  const [title, setTitle] = useState("");
  const [targetType, setTargetType] = useState<TargetType | "">("");

  const [refreshKey, setRefreshKey] = useState(0);

  const { data, total, loading } = useMessageList({
    boxType,
    offset,
    limit,
    targetType: targetType || undefined,
    title: title.trim() || undefined,
    refreshKey
  });

  const onSubmitSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setTitle(draftTitle.trim());
    setTargetType(draftTargetType);
    setOffset(0);
  }, [draftTitle, draftTargetType]);

  const current = Math.floor(offset / limit) + 1;

  const pagerRef = useRef<HTMLUListElement | null>(null);

  const {
    selectedIds,
    checkAllRef,
    allChecked,
    clear: clearSelection,
    toggleRow,
    toggleAll,
  } = useSelection({
    items: data,
    resetDeps: [boxType, offset, targetType, title],
  });


  const handleTabClick = useCallback((next: BoxType) => {
    setBoxType(next);
    setOffset(0);
    clearSelection();
    setDraftTitle("");
    setDraftTargetType("");
    setTitle("");
    setTargetType("");
  }, [clearSelection]);


  const handleRowClick = useCallback(
    (messageId: number) => navigate(`/messageDetail/${messageId}`),
    [navigate]
  );

  const { handleDeleteSelected } = useDeleteSelectedMessages({
    boxType,
    selectedIds,
    deleter: deleteSelectedMessages,
    onSuccess: () => {
      clearSelection();
      setRefreshKey((v) => v + 1);
    },
  });

  usePaginator({
    containerRef: pagerRef,
    current,
    totalItems: total,
    pageSize: limit,
    onChange: (page) => setOffset((page - 1) * limit),
  });

  return (
    <MessageListView
      boxType={boxType}
      data={data}
      total={total}
      loading={loading}
      draftTitle={draftTitle}
      draftTargetType={draftTargetType}
      onChangeDraftTitle={setDraftTitle}
      onChangeDraftTargetType={(v) => {
        setDraftTargetType(v);
        setTargetType(v);
        setOffset(0);
      }}
      onSubmitSearch={onSubmitSearch}
      onTabClick={handleTabClick}
      onDeleteSelected={handleDeleteSelected}
      deleteDisabled={selectedIds.length === 0}
      checkAllRef={checkAllRef}
      allChecked={allChecked}
      onToggleAll={toggleAll}
      selectedIds={selectedIds}
      onToggleRow={toggleRow}
      onRowClick={handleRowClick}
      pagerRef={pagerRef}
    />
  );
}