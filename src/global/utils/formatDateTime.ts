export function formatDateTime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const se = String(d.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${se}`;
}


export function formatUTCDateTime(iso: string | null) : string {
    if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  const se = String(d.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${se}`;
};

export function formatDateTimePlus9(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";

  const plus9 = new Date(d.getTime() + 9 * 60 * 60 * 1000);

  const yyyy = plus9.getFullYear();
  const mm = String(plus9.getMonth() + 1).padStart(2, "0");
  const dd = String(plus9.getDate()).padStart(2, "0");
  const hh = String(plus9.getHours()).padStart(2, "0");
  const mi = String(plus9.getMinutes()).padStart(2, "0");
  const se = String(plus9.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${se}`;
}
