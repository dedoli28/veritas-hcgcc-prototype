import { assumptions, sources, team } from "@/data/case";
import { Section } from "./ui";

export default function About() {
  return (
    <Section id="about" eyebrow="9 · About and sources" title="Team Veritas">
      <div className="grid gap-4 md:grid-cols-3">
        <article className="card">
          <h3 className="text-lg font-bold">Team</h3>
          <p className="mt-1 text-base text-muted">{team.school}</p>
          <ul className="mt-2 space-y-1 text-base">
            {team.members.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <p className="mt-3 text-base"><strong>Region:</strong> {team.region}</p>
        </article>
        <article className="card">
          <h3 className="text-lg font-bold">Sources</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted">
            {sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3 className="text-lg font-bold">Team assumptions</h3>
          <p className="text-base text-muted">These are our estimates, not reported figures:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted">
            {assumptions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </article>
      </div>
      <p className="mt-6 text-base text-muted">
        “Veritas Prototype” is a concept demo for a case competition. It collects no data, uses no cookies or analytics, and processes no payments.
      </p>
    </Section>
  );
}
