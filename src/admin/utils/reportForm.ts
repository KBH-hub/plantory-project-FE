import type { ReportListItem } from "@/admin/types/reportManagementType";

export function toBoolString(v: ReportListItem["status"]): "true" | "false" {
  if (typeof v === "boolean") return v ? "true" : "false";
  return v === "true" ? "true" : "false";
}
