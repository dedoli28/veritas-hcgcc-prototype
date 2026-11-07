"use client";

import { useState } from "react";
import { Octagon } from "lucide-react";
import { risks, type Level } from "@/data/plan";
import { Section } from "./ui";

const tone: Record<Level, string> = {
  High: "bg-dsoft text-danger",
  Medium: "bg-wsoft text-warn",
  Low: "bg-psoft text-fg",
};

export default function Risks() {
  const [tripped, setTripped] = useState<Set<number>>(new Set());
  const toggle = (id: number) =>
    setTripped((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <Section id="risks" eyebrow="7 · Risks" title="Risk matrix with tripwires" intro="Every risk has a mitigation and a measurable tripwire. Trip one to see the response.">
      <div className="card overflow-x-auto" tabIndex={0} role="region" aria-label="Risk matrix table">
        <table className="w-full min-w-[820px] border-collapse text-left text-base">
          <thead>
            <tr className="border-b border-line">
              {["Risk", "Likelihood", "Impact", "Mitigation", "Tripwire", "Status"].map((h) => (
                <th key={h} scope="col" className="px-2 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => {
              const on = tripped.has(r.id);
              return (
                <tr key={r.id} className={`border-b border-line align-top ${on ? "bg-dsoft" : ""}`}>
                  <th scope="row" className="px-2 py-3 font-semibold">{r.id}. {r.name}</th>
                  <td className="px-2 py-3"><span className={`chip ${tone[r.likelihood]}`}>{r.likelihood}</span></td>
                  <td className="px-2 py-3"><span className={`chip ${tone[r.impact]}`}>{r.impact}</span></td>
                  <td className="px-2 py-3 text-muted">{r.mitigation}</td>
                  <td className="px-2 py-3 text-muted">{r.tripwire}</td>
                  <td className="px-2 py-3">
                    {on ? (
                      <p className="mb-2 flex items-center gap-1 font-bold text-danger" role="status"><Octagon aria-hidden="true" className="h-4 w-4" /> Stop and review</p>
                    ) : (
                      <p className="mb-2 text-muted">Monitoring</p>
                    )}
                    <button className="btn !min-h-[40px]" aria-pressed={on} onClick={() => toggle(r.id)}>
                      {on ? "Reset" : "Trip it"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
