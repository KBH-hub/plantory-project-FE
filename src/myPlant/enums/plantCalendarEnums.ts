export const MODAL_STATE = {
    NONE: "NONE",
    DIARY_REGIST: "DIARY_REGIST",
    IMAGE_ADD: "IMAGE_ADD",
    DIARY_DETAIL: "DIARY_DETAIL",
} as const;

export type ModalState = (typeof MODAL_STATE)[keyof typeof MODAL_STATE];

export const MAX_PHOTO_FILES = 5 as const;
