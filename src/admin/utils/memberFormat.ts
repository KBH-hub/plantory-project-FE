export function getRemainDays(stopDay: string | null) {
  if (!stopDay) return "-";
  const target = new Date(String(stopDay).replace(" ", "T"));
  const diffDays = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays}일` : "-";
}

export function formatCreatedAt(createdAt: string | null) {
  if (!createdAt) return "";
  return String(createdAt).replace("T", " ").substring(0, 16);
}
