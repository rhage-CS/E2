export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const GRID_MAX = 4;

/** One compass heading: its name and how one step forward moves the rover. */
type Direction = {
  readonly name: string;
  readonly dx: number;
  readonly dy: number;
};

/** Clockwise order: turning right advances one entry. */
const COMPASS: readonly Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

let x = 2;
let y = 2;
let direction = 0;

function clampToGrid(value: number): number {
  return Math.min(GRID_MAX, Math.max(0, value));
}
function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    COMPASS[direction].name
  }`;
}

// Commands

/** A request the operator can give the rover. */
type Command = {
  readonly label: string;
  execute(): void;
};

const forwardCommand: Command = {
  label: "Forward",
  execute() {
    const { dx, dy } = COMPASS[direction];
    x = clampToGrid(x + dx);
    y = clampToGrid(y + dy);
  },
};

const rightCommand: Command = {
  label: "Right",
  execute() {
    direction = (direction + 1) % COMPASS.length;
  },
};

/** The invoker: runs whatever command it is given, then redraws. */
function invoke(command: Command) {
  command.execute();
  drawRover();
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () =>
  invoke(forwardCommand);
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () =>
  invoke(rightCommand);
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
