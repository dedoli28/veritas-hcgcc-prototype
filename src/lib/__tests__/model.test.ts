import { describe, expect, it } from "vitest";
import { calculate, defaultInputs, marketBreakdown, presets, grossProfitRunRate } from "../model";

const round1 = (n: number) => Math.round(n * 10) / 10;

describe("lever model", () => {
  const r = calculate(defaultInputs());

  it("reproduces each lever at defaults", () => {
    expect(round1(r.byLever.moment)).toBe(54.6);
    expect(round1(r.byLever.max)).toBe(26.4);
    expect(round1(r.byLever.family)).toBe(12.0);
    expect(round1(r.byLever.lite)).toBe(18.0);
    expect(round1(r.byLever.free)).toBe(9.0);
  });

  it("totals exactly $120.0M", () => {
    expect(round1(r.total)).toBe(120.0);
    expect(r.total).toBeCloseTo(120, 9);
  });

  it("rolls up to moves S1 63.6, S2 38.4, S3 18.0", () => {
    expect(round1(r.byMove.S1)).toBe(63.6);
    expect(round1(r.byMove.S2)).toBe(38.4);
    expect(round1(r.byMove.S3)).toBe(18.0);
  });

  it("adds 1.74M new payers, about +1.2 paid-share points", () => {
    expect(r.newPayersM).toBeCloseTo(1.74, 9);
    expect(round1(r.paidSharePointsGain)).toBe(1.2);
  });

  it("matches the presets: 90, 120, 144, ~102", () => {
    const by = Object.fromEntries(presets.map((p) => [p.id, calculate(defaultInputs(), p.scale).total]));
    expect(by.base).toBeCloseTo(120, 9);
    expect(by.low).toBeCloseTo(90, 9);
    expect(by.high).toBeCloseTo(144, 9);
    expect(by.haircut).toBeCloseTo(102, 9);
    expect(round1(calculate(defaultInputs(), 0.85).shareOfBasePct)).toBe(8.5);
  });
});

describe("market breakdown", () => {
  const b = marketBreakdown();
  it("sums to $111.0M plus $9.0M free-learner purchases", () => {
    expect(round1(b.subtotal)).toBe(111.0);
    expect(round1(b.free)).toBe(9.0);
    expect(b.total).toBeCloseTo(120, 9);
  });
  it("matches per-market revenue", () => {
    const rev = Object.fromEntries(b.rows.map((x) => [x.market.id, round1(x.revenue)]));
    expect(rev).toEqual({ uscanuk: 51.2, brazil: 16.8, mexico: 10.9, jpde: 16.3, india: 9.0, indonesia: 6.7 });
  });
});

describe("economics", () => {
  it("run-rate gross profit is about $87M", () => {
    expect(Math.round(grossProfitRunRate(120))).toBe(87);
  });
});
