"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { baseFacts, growthBars, priceCauses, problems } from "@/data/case";
import { Counter, Est, Section } from "./ui";

const tick = { fill: "var(--muted)", fontSize: 14 };

export default function Problems() {
  const arpdau = [
    { name: "Prior year", value: baseFacts.arpdauPrev },
    { name: "Q2 2026", value: baseFacts.arpdauNow },
  ];
  const price = [
    { name: "List price", value: baseFacts.listPrice },
    { name: "Realized", value: baseFacts.realizedPrice },
  ];

  return (
    <Section
      id="problem"
      eyebrow="1 · The problem"
      title="Users grow much faster than dollars"
      intro={`ARPDAU = total bookings ÷ (DAU × ${baseFacts.daysInQuarter} days). Daily users are up ${baseFacts.dauGrowthPct}%, bookings only ${baseFacts.bookingsGrowthPct}%.`}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {problems.map((p) => (
          <article key={p.id} className="card">
            <span className="chip">{p.id}</span>
            <h3 className="mt-3 text-lg font-bold">{p.title}</h3>
            <p className="mt-2 text-5xl font-extrabold text-primary">
              <Counter target={p.value} decimals={p.decimals} prefix={p.prefix} suffix={p.suffix} />
            </p>
            <p className="text-base font-semibold">{p.headline}</p>
            <p className="mt-2 text-base text-muted">{p.evidence}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <figure className="card" aria-label="Year over year growth chart">
          <figcaption className="text-lg font-bold">Year-over-year growth (%)</figcaption>
          <div className="mt-3 h-64" role="img" aria-label="Bar chart: DAU plus 23 percent, subscription bookings plus 10, total bookings plus 8, revenue plus 18">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthBars} margin={{ top: 20, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="name" tick={tick} interval={0} tickFormatter={(v: string) => (v === "Subscription bookings" ? "Subs." : v === "Total bookings" ? "Bookings" : v)} />
                <YAxis tick={tick} unit="%" />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {growthBars.map((b) => (
                    <Cell key={b.name} style={{ fill: b.name === "DAU" ? "var(--c1)" : "var(--c4)" }} />
                  ))}
                  <LabelList dataKey="value" position="top" formatter={(v) => `+${v}%`} style={{ fill: "var(--fg)", fontSize: 14, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-base text-muted">“Subs.” = subscription bookings. Revenue lags because subscriptions are recognized over about 12 months.</p>
        </figure>

        <figure className="card" aria-label="ARPDAU chart">
          <figcaption className="text-lg font-bold">ARPDAU ($ per daily user per day)</figcaption>
          <div className="mt-3 h-64" role="img" aria-label="Bar chart: ARPDAU fell from 6.2 cents to 5.4 cents, down 12 percent">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={arpdau} margin={{ top: 20, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="var(--line)" vertical={false} />
                <XAxis dataKey="name" tick={tick} />
                <YAxis tick={tick} domain={[0, 0.07]} tickFormatter={(v: number) => `$${v.toFixed(2)}`} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  <Cell style={{ fill: "var(--c4)" }} />
                  <Cell style={{ fill: "var(--c2)" }} />
                  <LabelList dataKey="value" position="top" formatter={(v) => `$${Number(v).toFixed(3)}`} style={{ fill: "var(--fg)", fontSize: 14, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-base text-muted">A {baseFacts.arpdauChangePct}% change year over year.</p>
        </figure>
      </div>

      <figure className="card mt-4" aria-label="List price versus realized price">
        <figcaption className="text-lg font-bold">
          List price vs realized price per payer ($ a month)
          <Est tip="List price is the midpoint of $12.99–13.99. Realized price is a team estimate.">estimate</Est>
        </figcaption>
        <div className="mt-3 grid items-center gap-6 md:grid-cols-2">
          <div className="h-48" role="img" aria-label="Bar chart: list price 13.49 dollars, realized 6.70 dollars">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={price} layout="vertical" margin={{ top: 4, right: 48, left: 20, bottom: 0 }}>
                <XAxis type="number" hide domain={[0, 15]} />
                <YAxis type="category" dataKey="name" tick={tick} width={80} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  <Cell style={{ fill: "var(--c4)" }} />
                  <Cell style={{ fill: "var(--c1)" }} />
                  <LabelList dataKey="value" position="right" formatter={(v) => `$${Number(v).toFixed(2)}`} style={{ fill: "var(--fg)", fontSize: 14, fontWeight: 700 }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-base font-bold">Why only about half?</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-base text-muted">
              {priceCauses.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ol>
          </div>
        </div>
      </figure>
    </Section>
  );
}
