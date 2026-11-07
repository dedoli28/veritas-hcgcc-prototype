import { competitors, opportunities, strengths, threats, weaknesses } from "@/data/case";
import { Section } from "./ui";

export default function Analysis() {
  const swot = [
    { t: "Strengths", l: strengths, c: "bg-psoft" },
    { t: "Weaknesses", l: weaknesses, c: "bg-wsoft" },
    { t: "Opportunities", l: opportunities, c: "bg-psoft" },
    { t: "Threats", l: threats, c: "bg-dsoft" },
  ];
  return (
    <Section id="analysis" eyebrow="8 · Analysis" title="SWOT and competitors">
      <div className="grid gap-4 sm:grid-cols-2">
        {swot.map((s) => (
          <article key={s.t} className={`card ${s.c}`}>
            <h3 className="text-lg font-extrabold">{s.t}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base">
              {s.l.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <h3 className="mt-8 text-xl font-extrabold">Competitors and our answer</h3>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {competitors.map((c) => (
          <article key={c.name} className="card">
            <h4 className="text-lg font-bold">{c.name}</h4>
            <p className="mt-1 text-base text-muted"><strong className="text-fg">Threat:</strong> {c.threat}</p>
            <p className="mt-2 text-base"><strong className="text-primary">Our answer:</strong> {c.answer}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
