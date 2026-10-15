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
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < count ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${count} / 10 shield`, 12, 100);
  readout.textContent = `Shield charge: ${count} / 10`;
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats();
}

function renderStats() {
  if (!panel) return;
  panel.textContent = `Shield charge: ${count} · Missing charge: ${10 - count}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  drawMeter();
  if (panel) updateStats();
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats();
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
drawMeter();
