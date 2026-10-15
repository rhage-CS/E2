export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
const SHIELD_CAPACITY = 10;

/** What the shield means right now. Shared by the HUD meter and the inspector. */
type ShieldSnapshot = {
  readonly charge: number;
  readonly capacity: number;
  readonly missing: number;
};

let charge = 0;
let inspectorDeliveries = 0;

/** Announces completed shield changes. */
const shieldEvents = new EventTarget();
const SHIELD_CHANGED = "shield-changed";

/** Prepared without DOM or canvas access. */
function snapshotShield(): ShieldSnapshot {
  return {
    charge,
    capacity: SHIELD_CAPACITY,
    missing: SHIELD_CAPACITY - charge,
  };
}

function drawMeter(shield: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.charge} / ${shield.capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${shield.charge} / ${shield.capacity}`;
}

function setCharge(next: number) {
  const bounded = Math.max(0, Math.min(SHIELD_CAPACITY, next));
  if (bounded === charge) return;
  charge = bounded;
  shieldEvents.dispatchEvent(new Event(SHIELD_CHANGED));
}

// Permanent HUD: wired outside the charge-changing code.
shieldEvents.addEventListener(SHIELD_CHANGED, () => {
  drawMeter(snapshotShield());
});

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCharge(charge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCharge(charge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCharge(0);
};
// Detachable inspector

/** An open inspector: its panel and the listener it subscribed with. */
type Inspector = {
  readonly panel: HTMLParagraphElement;
  readonly onShieldChanged: () => void;
};

let inspector: Inspector | null = null;

function renderInspector(panel: HTMLParagraphElement, shield: ShieldSnapshot) {
  panel.textContent =
    `Shield charge: ${shield.charge} · Missing charge: ${shield.missing}`;
}

function openInspector() {
  if (inspector) return;
  const panel = document.createElement("p");
  host.append(panel);
  renderInspector(panel, snapshotShield()); // initial render: not a delivery
  const onShieldChanged = () => {
    inspectorDeliveries++;
    diagnostic.textContent = `Inspector deliveries: ${inspectorDeliveries}`;
    renderInspector(panel, snapshotShield());
  };
  shieldEvents.addEventListener(SHIELD_CHANGED, onShieldChanged);
  inspector = { panel, onShieldChanged };
}

function closeInspector() {
  if (!inspector) return;
  shieldEvents.removeEventListener(SHIELD_CHANGED, inspector.onShieldChanged);
  inspector.panel.remove();
  inspector = null;
}

document.querySelector<HTMLButtonElement>("#counter-open")!.onclick =
  openInspector;
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick =
  closeInspector;

drawMeter(snapshotShield());
