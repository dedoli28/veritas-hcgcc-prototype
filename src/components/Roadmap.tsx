"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, PauseCircle } from "lucide-react";
import { grossProfitRunRate } from "@/lib/model";
import { evaluateTest } from "@/lib/guardrails";
import { kpiPhases, kpis, phases, programmeCostM, programmeMonths, stopRules } from "@/data/plan";
import { Est, Section } from "./ui";

export default function Roadmap() {
  const [sel, setSel] = useState(1);
  const [m, setM] = useState({ d30DeltaPt: 0, lessonsDeltaPct: 0, dismissRatePct: 30, npsDeltaPt: 0 });
  const verdict = evaluateTest(m);
  const gp = grossProfitRunRate(120);

  const sliders: { key: keyof typeof m; label: string; min: number; max: number; step: number; unit: string }[] = [
    { key: "d30DeltaPt", label: "D30 retention vs control", min: -2, max: 1, step: 0.1, unit: " pt" },
    { key: "lessonsDeltaPct", label: "Lessons per DAU vs control", min: -5, max: 2, step: 0.1, unit: "%" },
    { key: "dismissRatePct", label: "Offer dismiss rate", min: 0, max: 100, step: 1, unit: "%" },
    { key: "npsDeltaPt", label: "NPS vs control", min: -8, max: 4, step: 0.5, unit: " pt" },
  ];

  return (
    <Section id="roadmap" eyebrow="6 · Roadmap and KPIs" title="Prove, scale, compound" intro="Three phases over 26 months, with a 10% holdout in every test.">
      <div className="grid gap-4 md:grid-cols-3">
        {phases.map((p) => (
          <article key={p.id} className="card">
            <span className="chip">Phase {p.id}</span>
            <h3 className="mt-2 text-xl font-extrabold">{p.name}</h3>
            <p className="text-base text-muted">{p.window}</p>
            <p className="mt-2 text-base font-semibold">
              ~${p.costM}M · {p.fte} <Est>assumption</Est>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted">
              {p.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="card mt-4 text-base">
        <strong>Cost vs payoff:</strong> about ${programmeCostM}M of programme cost over {programmeMonths} months, against about ${Math.round(gp)}M a year of gross profit at run-rate ($120M × 72.6% gross margin).
        <Est>estimate</Est>
      </p>

      <div className="card mt-4">
        <h3 className="text-lg font-bold">KPI targets</h3>
        <div role="radiogroup" aria-label="Choose a phase" className="mt-3 flex flex-wrap gap-2">
          {kpiPhases.slice(1).map((p, i) => (
            <button key={p} role="radio" aria-checked={sel === i + 1} className="btn" onClick={() => setSel(i + 1)}>
              {p}
            </button>
          ))}
        </div>
        <div className="mt-3 overflow-x-auto" tabIndex={0} role="region" aria-label="KPI table">
          <table className="w-full min-w-[520px] border-collapse text-left text-base">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-3">KPI</th>
                <th scope="col" className="px-3 py-2">{kpiPhases[0]}</th>
                <th scope="col" className="px-3 py-2 text-primary">{kpiPhases[sel]}</th>
              </tr>
            </thead>
            <tbody>
              {kpis.map((k) => (
                <tr key={k.name} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pr-3 font-semibold">{k.name}</th>
                  <td className="px-3 py-2 text-muted">{k.values[0]}</td>
                  <td className="px-3 py-2 font-bold">{k.values[sel]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-base text-muted">Targets are team estimates <Est>estimate</Est></p>
      </div>

      <div className="card mt-4">
        <h3 className="text-lg font-bold">Experiment stop rules</h3>
        <p className="text-base text-muted">
          A test stops if D30 retention is more than {stopRules.d30Pt} pt below control, lessons per DAU more than {stopRules.lessonsPct}% below, or NPS more than {stopRules.npsPt} points below. A dismiss rate above {stopRules.dismissPct}% pauses it for redesign. Move the sliders.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {sliders.map((s) => (
            <label key={s.key} className="text-base">
              {s.label}: <strong>{m[s.key].toFixed(s.step < 1 ? 1 : 0)}{s.unit}</strong>
              <input type="range" min={s.min} max={s.max} step={s.step} value={m[s.key]} onChange={(e) => setM((p) => ({ ...p, [s.key]: Number(e.target.value) }))} />
            </label>
          ))}
        </div>
        <div
          role="status"
          className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-base font-semibold ${verdict.status === "ok" ? "bg-psoft" : verdict.status === "pause" ? "bg-wsoft text-warn" : "bg-dsoft text-danger"}`}
        >
          {verdict.status === "ok" ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" /> : verdict.status === "pause" ? <PauseCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" /> : <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />}
          <span>
            {verdict.status === "ok" ? "Within guardrails: the test continues." : verdict.status === "pause" ? "Pause and redesign. " : "Stop the test. "}
            {verdict.reasons.join("; ")}
          </span>
        </div>
      </div>
    </Section>
  );
}
