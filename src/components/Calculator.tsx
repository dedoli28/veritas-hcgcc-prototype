"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { annualBaseM, baseFacts } from "@/data/case";
import { levers, moves } from "@/data/levers";
import { calculate, defaultInputs, marketBreakdown, presets, type Inputs } from "@/lib/model";
import { Est, Section } from "./ui";

const scaled = (s: number): Inputs => {
  const d = defaultInputs();
  for (const l of levers) d[l.id] = { volumeM: d[l.id].volumeM * s, price: d[l.id].price };
  return d;
};

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(defaultInputs());
  const [preset, setPreset] = useState<string>("base");

  const r = useMemo(() => calculate(inputs), [inputs]);
  const mb = useMemo(() => marketBreakdown(inputs), [inputs]);

  const apply = (id: string, s: number) => {
    setPreset(id);
    setInputs(scaled(s));
  };
  const set = (id: (typeof levers)[number]["id"], key: "volumeM" | "price", v: number) => {
    setPreset("custom");
    setInputs((p) => ({ ...p, [id]: { ...p[id], [key]: v } }));
  };

  const bar = [{ name: "Revenue", S1: r.byMove.S1, S2: r.byMove.S2, S3: r.byMove.S3 }];

  return (
    <Section
      id="impact"
      eyebrow="5 · The impact model"
      title="What the three moves add up to"
      intro={
        <>
          Volume (million payers) × price ($ a year) per lever. All volumes and prices are team assumptions <Est>assumption</Est>
        </>
      }
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario presets">
        {presets.map((p) => (
          <button key={p.id} className="btn" aria-pressed={preset === p.id} onClick={() => apply(p.id, p.scale)}>
            {p.label}
          </button>
        ))}
        {preset === "custom" && <span className="chip self-center">Custom</span>}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[3fr_2fr]">
        <div className="card space-y-5">
          {levers.map((l) => {
            const v = inputs[l.id];
            return (
              <fieldset key={l.id} className="grid gap-2 border-b border-line pb-4 last:border-0 last:pb-0">
                <legend className="mb-1 text-base font-bold">
                  {l.label} <span className="chip">{l.move}</span>
                </legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-base">
                    Volume: <strong>{v.volumeM.toFixed(2)}M</strong>
                    <input type="range" min={0} max={Number((l.volumeM * 2).toFixed(2))} step={0.01} value={v.volumeM} onChange={(e) => set(l.id, "volumeM", Number(e.target.value))} />
                  </label>
                  <label className="text-base">
                    Price: <strong>${v.price.toFixed(0)} a year</strong>
                    <input type="range" min={0} max={l.price * 2} step={1} value={v.price} onChange={(e) => set(l.id, "price", Number(e.target.value))} />
                  </label>
                </div>
                <p className="text-base text-muted">= ${r.byLever[l.id].toFixed(1)}M</p>
              </fieldset>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="card">
            <p className="text-base font-semibold text-muted">Annual run-rate by end-2028</p>
            <p className="text-5xl font-extrabold text-primary" aria-live="polite" data-testid="total">
              ${r.total.toFixed(1)}M
            </p>
            <p className="text-base text-muted">
              {r.shareOfBasePct.toFixed(1)}% of the ${(annualBaseM / 1000).toFixed(2)}B base (Q2 2026 revenue ${baseFacts.revenueM}M × 4)
            </p>
            <div className="mt-3 h-24" role="img" aria-label={`Stacked bar: S1 ${r.byMove.S1.toFixed(1)}, S2 ${r.byMove.S2.toFixed(1)}, S3 ${r.byMove.S3.toFixed(1)} million dollars`}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={bar} margin={{ top: 0, right: 8, left: 8, bottom: 0 }}>
                  <XAxis type="number" hide domain={[0, 160]} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip formatter={(v) => `$${Number(v).toFixed(1)}M`} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--fg)", fontSize: 14 }} />
                  <Legend wrapperStyle={{ fontSize: 14 }} />
                  <Bar dataKey="S1" stackId="a" fill="var(--c1)" name="S1 Moments" isAnimationActive={false} />
                  <Bar dataKey="S2" stackId="a" fill="var(--c2)" name="S2 Tiers" isAnimationActive={false} />
                  <Bar dataKey="S3" stackId="a" fill="var(--c3)" name="S3 Local" isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-1 text-base">
              {(["S1", "S2", "S3"] as const).map((k) => (
                <li key={k}>
                  <strong>{k}</strong> {moves[k].name}: ${r.byMove[k].toFixed(1)}M
                </li>
              ))}
            </ul>
          </div>

          <div className="card text-base">
            <h3 className="font-bold">Paid-share impact <Est>estimate</Est></h3>
            <p className="mt-1 text-muted">
              +{r.newPayersM.toFixed(2)}M new payers (offers + Lite) ≈ <strong className="text-fg">+{r.paidSharePointsGain.toFixed(1)} points</strong> of paid share ({baseFacts.mauM}M monthly users).
            </p>
            <a href="#market-table" className="mt-2 inline-block font-semibold text-primary underline">Jump to the market table</a>
          </div>
        </div>
      </div>

      <div id="market-table" className="card mt-4">
        <h3 className="text-lg font-bold">Revenue by market <Est>team split</Est></h3>
        <p className="text-base text-muted">Payers per market are our split. Revenue uses the prices set above.</p>
        <div className="mt-3 overflow-x-auto" tabIndex={0} role="region" aria-label="Market revenue table">
          <table className="w-full min-w-[640px] border-collapse text-left text-base">
            <thead>
              <tr className="border-b border-line">
                {["Market", "Moment offers (M)", "Max (M)", "Family (M)", "Lite (M)", "Revenue", "Wave"].map((h) => (
                  <th key={h} scope="col" className="px-2 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mb.rows.map(({ market: m, revenue }) => (
                <tr key={m.id} className="border-b border-line">
                  <th scope="row" className="px-2 py-2 font-semibold">{m.name}</th>
                  <td className="px-2">{m.moment.toFixed(2)}</td>
                  <td className="px-2">{m.max.toFixed(2)}</td>
                  <td className="px-2">{m.family.toFixed(2)}</td>
                  <td className="px-2">{m.lite.toFixed(2)}</td>
                  <td className="px-2 font-semibold">${revenue.toFixed(1)}M</td>
                  <td className="px-2">{m.wave}</td>
                </tr>
              ))}
              <tr className="border-b border-line font-bold">
                <th scope="row" className="px-2 py-2">Subtotal</th>
                <td colSpan={4} />
                <td className="px-2" data-testid="subtotal">${mb.subtotal.toFixed(1)}M</td>
                <td />
              </tr>
              <tr className="border-b border-line">
                <th scope="row" className="px-2 py-2 font-semibold">Free-learner purchases (global)</th>
                <td colSpan={4} className="px-2">{inputs.free.volumeM.toFixed(2)}M buyers × ${inputs.free.price}</td>
                <td className="px-2 font-semibold">${mb.free.toFixed(1)}M</td>
                <td />
              </tr>
              <tr className="font-extrabold">
                <th scope="row" className="px-2 py-2">Total</th>
                <td colSpan={4} />
                <td className="px-2 text-primary">${mb.total.toFixed(1)}M</td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-base text-muted">
          Not counted: about $23M extra (music and chess ~$8M, corporate B2B ~$10M, English Test licences ~$5M) <Est>estimate</Est> and about $20M gross profit from web checkout at a 10% shift <Est>estimate</Est>.
        </p>
      </div>
    </Section>
  );
}
