import { MessageItemRequest } from "@/domain/message/types/message";

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const se = String(d.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${se}`;
};

const labelTargetType = (t: string) => {
  switch (t) {
    case "SHARING":
      return "나눔";
    case "QUESTION":
      return "질문";
    default:
      return t ?? "";
  }
};

export default function MessageItem({ data, selectedIds, onToggleRow, onRowClick }: MessageItemRequest) {
  if (data.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="text-center text-muted py-4">
          쪽지가 없습니다.
        </td>
      </tr>
    );
  }

  return (
    <>
      {data.map((item) => {
        const isUnread = !item.readFlag;
        const rowClass = `cursor-pointer${isUnread ? " fw-semibold" : ""}`;
        const readText = item.readFlag ? "읽음" : "안읽음";
        const category = labelTargetType(item.targetType);
        const relatedText = item.targetTitle || "(삭제된 쪽지)";

        return (
          <tr
            key={item.messageId}
            data-id={item.messageId}
            className={rowClass}
            onClick={() => onRowClick(item.messageId)}
          >
            <td className="text-center" style={{ width: 44 }}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={selectedIds.includes(item.messageId)}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => onToggleRow(item.messageId, e.target.checked)}
              />
            </td>

            <td style={{ width: 96 }}>{readText}</td>
            <td style={{ width: 120 }}>{item.senderNickname ?? ""}</td>
            <td style={{ width: 120 }}>{item.receiverNickname ?? ""}</td>
            <td style={{ width: 90 }}>{category}</td>

            <td className="text-truncate" style={{ maxWidth: 180 }}>
              {item.title || ""}
            </td>

            <td className="text-truncate">{relatedText}</td>

            <td className="text-nowrap" style={{ width: 170 }}>
              {formatDateTime(item.createdAt)}
            </td>
          </tr>
        );
      })}
    </>
  );
}