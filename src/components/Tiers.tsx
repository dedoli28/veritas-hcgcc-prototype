"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { levers } from "@/data/levers";
import { Est, Section } from "./ui";

const THRESHOLD = 1; // cents per call

type Cell = string | boolean;
const tiers = ["Super Lite", "Super", "Max", "Family"] as const;

export default function Tiers() {
  const [cost, setCost] = useState(5);
  const videoAtSuper = cost <= THRESHOLD;

  const rows: { feature: string; v: [Cell, Cell, Cell, Cell] }[] = [
    { feature: "Ads", v: ["With ads", "No ads", "No ads", "No ads"] },
    { feature: "Energy limits", v: ["Limited", "Unlimited", "Unlimited", "Unlimited"] },
    { feature: "AI speaking practice", v: ["Basic or none", "Included", "Extended", "Included"] },
    { feature: "Video Call", v: [false, videoAtSuper ? "Rolling out" : "Not yet", true, videoAtSuper ? "Rolling out" : "Not yet"] },
    { feature: "Family seats", v: [false, false, false, "Parent-managed"] },
  ];

  const max = levers.find((l) => l.id === "max")!;
  const fam = levers.find((l) => l.id === "family")!;

  return (
    <Section
      id="tiers"
      eyebrow="3 · Solution S2 · Tier ladder"
      title="Four rungs, one clear next step"
      intro="Super Lite, Super, Max and Family. Feature lists are illustrative. Video Call reaches Super once AI cost per call falls below 1 cent."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((t, i) => (
          <article key={t} className="card">
            <p className="text-sm font-bold uppercase tracking-wide text-muted">Rung {i + 1}</p>
            <h3 className="text-xl font-extrabold">{t}</h3>
            <p className="mt-1 text-base text-muted">
              {["Ad-supported entry point in local-price markets", "The core paid plan", "Premium AI practice", "Retention anchor for households"][i]}
            </p>
          </article>
        ))}
      </div>

      <div className="card mt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold">
            Feature comparison <Est tip="Illustrative feature lists, not an official plan sheet">illustrative</Est>
          </h3>
        </div>
        <div className="mt-3 overflow-x-auto" tabIndex={0} role="region" aria-label="Tier feature comparison table">
          <table className="w-full min-w-[640px] border-collapse text-left text-base">
            <thead>
              <tr className="border-b border-line">
                <th scope="col" className="py-2 pr-3">Feature</th>
                {tiers.map((t) => (
                  <th key={t} scope="col" className="px-3 py-2">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.feature} className="border-b border-line last:border-0">
                  <th scope="row" className="py-2 pr-3 font-semibold">{r.feature}</th>
                  {r.v.map((c, i) => (
                    <td key={i} className="px-3 py-2">
                      {c === true ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-primary"><Check aria-hidden="true" className="h-4 w-4" /> Yes</span>
                      ) : c === false ? (
                        <span className="inline-flex items-center gap-1 text-muted"><Minus aria-hidden="true" className="h-4 w-4" /> No</span>
                      ) : (
                        c
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="card">
          <label htmlFor="ai-cost" className="text-lg font-bold">AI cost per call: {cost.toFixed(1)} ¢</label>
          <input
            id="ai-cost"
            type="range"
            min={0.5}
            max={5}
            step={0.1}
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            aria-valuetext={`${cost.toFixed(1)} cents per call`}
            className="mt-2"
          />
          <div className="relative h-6 text-sm text-muted" aria-hidden="true">
            <span className="absolute left-0">0.5¢</span>
            <span className="absolute font-bold text-primary" style={{ left: `${((THRESHOLD - 0.5) / 4.5) * 100}%` }}>▲ 1¢ threshold</span>
            <span className="absolute right-0">5¢</span>
          </div>
          <p
            className={`mt-3 rounded-lg p-3 text-base font-semibold ${videoAtSuper ? "bg-psoft" : "bg-wsoft text-warn"}`}
            role="status"
          >
            {videoAtSuper
              ? "At or below 1¢ a call, AI practice and Video Call become feasible for Super and Family. Max keeps the extended premium."
              : "Above 1¢ a call, Video Call stays a Max-only feature to protect margin. Slide down to see it open up."}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-bold">Premium numbers <Est>estimate</Est></h3>
          <dl className="mt-2 space-y-3 text-base">
            <div>
              <dt className="font-semibold">Max upgrade</dt>
              <dd className="text-muted">${max.price} a year × {max.volumeM}M upgrades = ${(max.price * max.volumeM).toFixed(1)}M</dd>
            </div>
            <div>
              <dt className="font-semibold">Family up-mix</dt>
              <dd className="text-muted">${fam.price} a year × {fam.volumeM}M payers = ${(fam.price * fam.volumeM).toFixed(1)}M</dd>
            </div>
          </dl>
        </div>
      </div>
    </Section>
  );
}
