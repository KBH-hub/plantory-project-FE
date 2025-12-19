type AlertCallback = (() => void) | null;

export interface AlertOptions {
  callback?: AlertCallback;
  noOverlay?: boolean;
}

const FADE_MS = 180;

const createIfNotExists = (id: string, className: string, innerHTML: string) => {
  if (document.getElementById(id)) return;

  const modalHTML = `
    <div id="${id}" class="${className}" style="display:none; opacity:0;">
      <div class="${className}-content">
        ${innerHTML}
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", modalHTML);
};

const setVisible = (modalEl: HTMLElement, visible: boolean) => {
  if (visible) {
    modalEl.style.display = "flex";
    requestAnimationFrame(() => {
      modalEl.style.opacity = "1";
    });
    return;
  }

  modalEl.style.opacity = "0";
  window.setTimeout(() => {
    modalEl.style.display = "none";
  }, FADE_MS);
};

const disableDrag = (rootSelector: string) => {
  document.querySelectorAll(`${rootSelector}, ${rootSelector} *`).forEach((el) => {
    el.setAttribute("draggable", "false");
  });
};

let initialized = false;

let alertModal: HTMLElement | null = null;
let alertMessageEl: HTMLElement | null = null;
let alertOkBtn: HTMLButtonElement | null = null;

let confirmModalEl: HTMLElement | null = null;
let confirmMessageEl: HTMLElement | null = null;
let confirmYesBtn: HTMLButtonElement | null = null;
let confirmNoBtn: HTMLButtonElement | null = null;

const init = () => {
  if (initialized) return;
  initialized = true;

  // Alert
  createIfNotExists(
    "customAlertModal",
    "custom-alert-modal",
    `
      <p id="customAlertMessage">알림 메시지 내용</p>
      <div class="custom-alert-modal-buttons">
        <button id="customAlertOk" type="button">확인</button>
      </div>
    `
  );

  alertModal = document.getElementById("customAlertModal");
  alertMessageEl = document.getElementById("customAlertMessage");
  alertOkBtn = document.getElementById("customAlertOk") as HTMLButtonElement | null;

  disableDrag("#customAlertModal");

  // Confirm
  createIfNotExists(
    "customConfirmModal",
    "custom-modal",
    `
      <p id="customConfirmMessage">정말 진행하시겠습니까?</p>
      <div class="custom-modal-buttons">
        <button id="customConfirmYes" type="button">예</button>
        <button id="customConfirmNo" type="button">아니오</button>
      </div>
    `
  );

  confirmModalEl = document.getElementById("customConfirmModal");
  confirmMessageEl = document.getElementById("customConfirmMessage");
  confirmYesBtn = document.getElementById("customConfirmYes") as HTMLButtonElement | null;
  confirmNoBtn = document.getElementById("customConfirmNo") as HTMLButtonElement | null;

  disableDrag("#customConfirmModal");
};

export const showModal = {
  alert(message: string, options: AlertOptions = {}): Promise<void> {
    init();
    if (!alertModal || !alertMessageEl || !alertOkBtn) return Promise.resolve();

    const { callback = null, noOverlay = false } = options;

    alertMessageEl.textContent = message;
    alertModal.classList.toggle("no-overlay", Boolean(noOverlay));
    setVisible(alertModal, true);

    return new Promise<void>((resolve) => {
      const handleOk = () => {
        setVisible(alertModal!, false);
        if (typeof callback === "function") callback();
        resolve();
      };
      alertOkBtn.addEventListener("click", handleOk, { once: true });
    });
  },

  confirm(message: string): Promise<boolean> {
    init();
    if (!confirmModalEl || !confirmMessageEl || !confirmYesBtn || !confirmNoBtn) {
      return Promise.resolve(false);
    }

    confirmMessageEl.textContent = message;
    setVisible(confirmModalEl, true);

    return new Promise<boolean>((resolve) => {
      const done = (result: boolean) => {
        setVisible(confirmModalEl!, false);
        resolve(result);
      };

      confirmYesBtn!.addEventListener("click", () => done(true), { once: true });
      confirmNoBtn!.addEventListener("click", () => done(false), { once: true });
    });
  },
};
