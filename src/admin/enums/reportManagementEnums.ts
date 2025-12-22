export const REPORT_TARGET_TYPE = "REPORT" as const;
export type ReportTargetType = typeof REPORT_TARGET_TYPE;

export const REPORT_STATUS = {
    DONE: "true",
    PENDING: "false",
} as const;

export type ReportStatusValue = (typeof REPORT_STATUS)[keyof typeof REPORT_STATUS];
