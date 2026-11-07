"use client";

import { useState } from "react";
import { CreditCard, QrCode, Smartphone, Store, Wallet } from "lucide-react";
import { markets, scoreLabels, type Market } from "@/data/levers";
import { Dots, Est, Section } from "./ui";

export const flows: Record<Market["checkout"], { title: string; icon: typeof CreditCard; steps: string[] }> = {
  card: { title: "Card or wallet", icon: CreditCard, steps: ["Choose plan", "Confirm in the store or processor’s secure sheet (no card fields here)", "Receipt and plan active"] },
  pix: { title: "Pix", icon: QrCode, steps: ["Choose plan", "Scan the QR code in your banking app", "Instant confirmation, plan active"] },
  oxxo: { title: "OXXO voucher", icon: Store, steps: ["Choose plan", "Get a voucher code to pay in cash at a store", "Pay at the counter; plan activates after payment clears"] },
  upi: { title: "UPI", icon: Smartphone, steps: ["Choose plan", "Approve the request in your UPI app", "Confirmation, plan active"] },
  wallet: { title: "E-wallet or carrier billing", icon: Wallet, steps: ["Choose plan", "Approve in your e-wallet app, or add it to your phone bill", "Confirmation, plan active"] },
};

export function FakeQr() {
  // Deterministic decorative pattern, not a real QR code.
  const cells = Array.from({ length: 49 }, (_, i) => ((i * 7 + (i % 5) * 3) % 4 === 0 || i % 9 === 0));
  return (
    <svg viewBox="0 0 7 7" className="h-32 w-32 rounded-lg border border-line bg-white p-1" role="img" aria-label="Decorative placeholder, not a real QR code">
      {cells.map((on, i) => on && <rect key={i} x={i % 7} y={Math.floor(i / 7)} width="1" height="1" fill="#111" />)}
    </svg>
  );
}

export default function LocalPricing() {
  const [id, setId] = useState(markets[1].id);
  const [step, setStep] = useState(0);
  const m = markets.find((x) => x.id === id)!;
  const flow = flows[m.checkout];
  const Icon = flow.icon;

  const pick = (mid: string) => {
    setId(mid);
    setStep(0);
  };

  return (
    <Section
      id="local"
      eyebrow="4 · Solution S3 · Price and pay locally"
      title="Meet each market where it pays"
      intro="PPP-calibrated price points tested market by market, with the payment rail people already use. Web checkout where platform rules allow."
    >
      <div role="radiogroup" aria-label="Choose a market" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {markets.map((x) => (
          <button
            key={x.id}
            role="radio"
            aria-checked={x.id === id}
            onClick={() => pick(x.id)}
            className={`card text-left transition-colors ${x.id === id ? "!border-primary !bg-psoft ring-2 ring-primary" : "hover:border-primary"}`}
          >
            <span className="flex items-center justify-between">
              <strong className="text-lg">{x.name}</strong>
              <span className="chip">Wave {x.wave}</span>
            </span>
            <span className="mt-1 block text-base text-muted">{x.rail}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <article className="card" aria-live="polite">
          <h3 className="text-xl font-extrabold">{m.name}</h3>
          <dl className="mt-3 space-y-2 text-base">
            <div><dt className="inline font-semibold">Local rail: </dt><dd className="inline text-muted">{m.rail}. {m.railDetail}</dd></div>
            <div><dt className="inline font-semibold">Planned tier: </dt><dd className="inline text-muted">{m.tier}</dd></div>
            <div><dt className="inline font-semibold">Launch wave: </dt><dd className="inline text-muted">{m.wave}</dd></div>
          </dl>
          <h4 className="mt-4 text-base font-bold">Market scores <Est tip="Our own qualitative assessment, 1–4 dots">team assessment</Est></h4>
          <ul className="mt-2 space-y-2">
            {scoreLabels.map((label, i) => (
              <li key={label} className="flex items-center justify-between gap-3 text-base">
                <span>{label}</span>
                <Dots n={m.scores[i]} label={label} />
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <Icon aria-hidden="true" className="h-5 w-5 text-primary" /> Checkout mock: {flow.title}
          </h3>
          <p className="text-base text-muted">No real payment, no card fields, nothing is collected.</p>
          <ol className="mt-3 space-y-2">
            {flow.steps.map((s, i) => (
              <li key={s} className={`rounded-lg border p-3 text-base ${i === step ? "border-primary bg-psoft font-semibold" : i < step ? "border-line text-muted line-through" : "border-line text-muted"}`} aria-current={i === step ? "step" : undefined}>
                {i + 1}. {s}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {m.checkout === "pix" && step === 1 && <FakeQr />}
            {m.checkout === "oxxo" && step === 1 && (
              <p className="rounded-lg border border-dashed border-line px-3 py-2 font-mono text-base" aria-label="Demo voucher code">DEMO 0000 0000 0000</p>
            )}
            {m.checkout === "upi" && step === 1 && <p className="rounded-lg border border-dashed border-line px-3 py-2 text-base">Approve request from “veritas-demo@upi” (fake)</p>}
            {step === flow.steps.length - 1 ? (
              <p className="font-bold text-primary" role="status">Done (simulated). Nothing was charged.</p>
            ) : (
              <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>Next step</button>
            )}
            {step > 0 && <button className="btn" onClick={() => setStep(0)}>Restart</button>}
          </div>
        </article>
      </div>
    </Section>
  );
}
