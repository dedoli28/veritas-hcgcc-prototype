import { ArrowRight, Calculator, PlayCircle } from "lucide-react";
import { baseFacts } from "@/data/case";

export default function Hero() {
  const stats = [
    { big: "−12%", label: "Revenue per daily user (ARPDAU), year over year" },
    { big: "~50%", label: "of list price kept per payer ($6.70 vs $13.49 a month)" },
    { big: "9.0%", label: "of monthly users pay" },
  ];
  return (
    <div id="top" className="border-b border-line bg-gradient-to-b from-psoft to-bg">
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
        <p className="chip">Concept demo · HCGCC 2026 · Team Veritas</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Turning daily habits into durable revenue
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-muted sm:text-xl">
          The case company has {baseFacts.dauM}M daily learners, but dollars are growing slower than users. Our idea:{" "}
          <strong className="text-fg">earn the upgrade, don’t gate the lesson</strong>. About $120M of annual run-rate by end-2028, with no friction brought back.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#simulator" className="btn btn-primary">
            <PlayCircle aria-hidden="true" className="h-5 w-5" /> Try the demo
          </a>
          <a href="#impact" className="btn">
            <Calculator aria-hidden="true" className="h-5 w-5" /> See the impact model <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.big} className="card">
              <dt className="text-4xl font-extrabold text-primary sm:text-5xl">{s.big}</dt>
              <dd className="mt-1 text-base text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
