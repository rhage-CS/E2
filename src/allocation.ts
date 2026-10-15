export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let n = 2;

function u() {
  const p = n * 3;
  const c = 6;
  const b = p - c;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < n ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < n ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${n} / 6`, 18, 76);
  ctx.fillText(`Production: ${p}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, p * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${c}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, c * 14, 20);
  readout.textContent =
    `Assigned: ${n}/6 · Production: ${p} · Consumption: ${c} · Balance: ${
      b > 0 ? "+" : ""
    }${b}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  n = Math.max(0, n - 1);
  u();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  n = Math.min(6, n + 1);
  u();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    n = 2;
    u();
  };
u();
