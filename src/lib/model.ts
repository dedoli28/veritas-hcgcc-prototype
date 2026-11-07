import { annualBaseM, baseFacts } from "@/data/case";
import { levers, markets, type Lever, type Market, type MoveId } from "@/data/levers";

export type Inputs = Record<Lever["id"], { volumeM: number; price: number }>;

export const defaultInputs = (): Inputs =>
  Object.fromEntries(levers.map((l) => [l.id, { volumeM: l.volumeM, price: l.price }])) as Inputs;

/** Revenue in $M for one lever: volume (M payers) x price ($/yr). */
export const leverRevenue = (volumeM: number, price: number) => volumeM * price;

export type Result = {
  byLever: Record<Lever["id"], number>;
  byMove: Record<MoveId, number>;
  total: number;
  newPayersM: number;
  paidSharePointsGain: number;
  shareOfBasePct: number;
};

export function calculate(inputs: Inputs, scale = 1): Result {
  const byLever = {} as Record<Lever["id"], number>;
  const byMove: Record<MoveId, number> = { S1: 0, S2: 0, S3: 0 };
  for (const l of levers) {
    const v = inputs[l.id];
    const rev = leverRevenue(v.volumeM * scale, v.price);
    byLever[l.id] = rev;
    byMove[l.move] += rev;
  }
  const total = byMove.S1 + byMove.S2 + byMove.S3;
  // New payers = moment-based offers + Lite payers (upgrades and up-mix are existing payers).
  const newPayersM = (inputs.moment.volumeM + inputs.lite.volumeM) * scale;
  return {
    byLever,
    byMove,
    total,
    newPayersM,
    paidSharePointsGain: (newPayersM / baseFacts.mauM) * 100,
    shareOfBasePct: (total / annualBaseM) * 100,
  };
}

export const presets = [
  { id: "base", label: "Base", scale: 1 },
  { id: "low", label: "Low −25%", scale: 0.75 },
  { id: "high", label: "High +20%", scale: 1.2 },
  { id: "haircut", label: "15% haircut", scale: 0.85 },
] as const;

/** Revenue per market ($M) at the given prices, derived from lever prices. */
export function marketRevenue(m: Market, inputs: Inputs = defaultInputs()): number {
  return (
    m.moment * inputs.moment.price +
    m.max * inputs.max.price +
    m.family * inputs.family.price +
    m.lite * inputs.lite.price
  );
}

export function marketBreakdown(inputs: Inputs = defaultInputs()) {
  const rows = markets.map((m) => ({ market: m, revenue: marketRevenue(m, inputs) }));
  const subtotal = rows.reduce((s, r) => s + r.revenue, 0);
  const free = leverRevenue(inputs.free.volumeM, inputs.free.price);
  return { rows, subtotal, free, total: subtotal + free };
}

/** Programme economics. */
export const grossProfitRunRate = (revenueM: number) => (revenueM * baseFacts.grossMarginPct) / 100;

export const fmtM = (n: number, d = 1) => `$${n.toFixed(d)}M`;
