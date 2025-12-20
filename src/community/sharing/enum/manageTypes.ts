export const MANAGE_LEVELS = [
  { value: "VERY_EASY", label: "매우 쉬움" },
  { value: "EASY", label: "쉬움" },
  { value: "NORMAL", label: "보통" },
  { value: "HARD", label: "어려움" },
  { value: "VERY_HARD", label: "매우 어려움" },
  { value: "ETC", label: "기타" },
] as const;

export const MANAGE_DEMANDS = [
  { value: "STRONG", label: "잘 견딤" },
  { value: "LITTLE_CARE", label: "약간 돌봄" },
  { value: "NEED_CARE", label: "필요함" },
  { value: "SPECIAL_CARE", label: "특별 관리 필요" },
  { value: "ETC", label: "기타" },
] as const;

export type ManageLevel =
  (typeof MANAGE_LEVELS)[number]["value"];

export type ManageDemand =
  (typeof MANAGE_DEMANDS)[number]["value"];