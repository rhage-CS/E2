export {};
// Provisioning rules
/** Everyone on Kestrel is provisioned, whatever their duty this shift. */
const CREW_SIZE = 6;
const DEFAULT_CREW_ON_SUPPLIES = 2;
const SUPPLIES_PER_CREW_ON_SUPPLIES = 3;
const RATION_PER_CREW_MEMBER = 1;

// Presentation constants

const INK = "#233e43";
const SUPPLY_GREEN = "#27766b";
const OTHER_DUTY_TILE = "#c9d2c9";
const TILE_NUMBER_ON_SUPPLIES = "#ffffff";
const NEED_RUST = "#a44d23";

const TILE_FONT = "16px system-ui";
const LABEL_FONT = "14px system-ui";

const LEFT_MARGIN = 18;
const TILE_PITCH = 45;
const TILE_TOP = 16;
const TILE_SIZE = 36;
const TILE_NUMBER_INSET = 13;
const TILE_NUMBER_BASELINE = 40;

const CREW_SUMMARY_BASELINE = 76;
const PRODUCTION_LABEL_BASELINE = 102;
const CONSUMPTION_LABEL_BASELINE = 154;
const LABEL_TO_BAR_GAP = 8;
const BAR_HEIGHT = 20;
const BAR_PX_PER_SUPPLY = 14;

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let crewOnSupplies = DEFAULT_CREW_ON_SUPPLIES;

// Calculation
function suppliesProduced(crewOnSupplies: number): number {
  return crewOnSupplies * SUPPLIES_PER_CREW_ON_SUPPLIES;
}

/** Care, repair, and rest shifts eat too: need is counted for the whole crew. */
function suppliesNeeded(): number {
  return CREW_SIZE * RATION_PER_CREW_MEMBER;
}

function calculateShift(crewOnSupplies: number) {
  const production = suppliesProduced(crewOnSupplies);
  const consumption = suppliesNeeded();
  return { production, consumption, balance: production - consumption };
}
// Canvas
function drawCrewTiles(crewOnSupplies: number) {
  for (let member = 0; member < CREW_SIZE; member++) {
    const onSupplies = member < crewOnSupplies;
    const tileX = LEFT_MARGIN + member * TILE_PITCH;
    ctx.fillStyle = onSupplies ? SUPPLY_GREEN : OTHER_DUTY_TILE;
    ctx.fillRect(tileX, TILE_TOP, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = onSupplies ? TILE_NUMBER_ON_SUPPLIES : INK;
    ctx.font = TILE_FONT;
    ctx.fillText(
      String(member + 1),
      tileX + TILE_NUMBER_INSET,
      TILE_NUMBER_BASELINE,
    );
  }
  ctx.fillStyle = INK;
  ctx.font = LABEL_FONT;
  ctx.fillText(
    `Producers: ${crewOnSupplies} / ${CREW_SIZE}`,
    LEFT_MARGIN,
    CREW_SUMMARY_BASELINE,
  );
}

function drawSupplyBars(production: number, consumption: number) {
  ctx.font = LABEL_FONT;

  ctx.fillStyle = INK;
  ctx.fillText(
    `Production: ${production}`,
    LEFT_MARGIN,
    PRODUCTION_LABEL_BASELINE,
  );

  ctx.fillStyle = SUPPLY_GREEN;
  ctx.fillRect(
    LEFT_MARGIN,
    PRODUCTION_LABEL_BASELINE + LABEL_TO_BAR_GAP,
    production * BAR_PX_PER_SUPPLY,
    BAR_HEIGHT,
  );

  ctx.fillStyle = INK;
  ctx.fillText(
    `Consumption: ${consumption}`,
    LEFT_MARGIN,
    CONSUMPTION_LABEL_BASELINE,
  );
  ctx.fillStyle = NEED_RUST;
  ctx.fillRect(
    LEFT_MARGIN,
    CONSUMPTION_LABEL_BASELINE + LABEL_TO_BAR_GAP,
    consumption * BAR_PX_PER_SUPPLY,
    BAR_HEIGHT,
  );
}
// Text readout
function formatSigned(value: number): string {
  return `${value > 0 ? "+" : ""}${value}`;
}

function writeReadout(
  crewOnSupplies: number,
  production: number,
  consumption: number,
  balance: number,
) {
  readout.textContent =
    `Assigned: ${crewOnSupplies}/${CREW_SIZE} · Production: ${production} · ` +
    `Consumption: ${consumption} · Balance: ${formatSigned(balance)}`;
}

// Shift update
function renderShift() {
  const { production, consumption, balance } = calculateShift(crewOnSupplies);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewTiles(crewOnSupplies);
  drawSupplyBars(production, consumption);
  writeReadout(crewOnSupplies, production, consumption, balance);
}

function assignCrewToSupplies(count: number) {
  crewOnSupplies = Math.min(CREW_SIZE, Math.max(0, count));
  renderShift();
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () =>
  assignCrewToSupplies(crewOnSupplies - 1);
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () =>
  assignCrewToSupplies(crewOnSupplies + 1);
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick = () =>
  assignCrewToSupplies(DEFAULT_CREW_ON_SUPPLIES);

renderShift();
