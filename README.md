# Veritas Prototype (HCGCC 2026)

An interactive concept demo by **Team Veritas** (Pertevniyal Highschool) for the HCGCC 2026 case competition, "Scaling Streaks, Sustaining Value". It shows how a language-learning company could turn a fast-growing base of daily learners into durable revenue without bringing friction back. Guiding principle: **earn the upgrade, don't gate the lesson.**

> **Disclaimer:** Concept prototype by Team Veritas, Pertevniyal Highschool, for HCGCC 2026. Not affiliated with Duolingo. All projections are team estimates. The case company is named in text only; no logos, mascots or artwork are used. No payments, logins, cookies, tracking or analytics. Everything runs in the browser.

## What is in it

1. Hero and headline stats
2. Problem dashboard (Recharts): growth vs bookings, ARPDAU, list vs realized price
3. **Moment-of-value simulator (S1)** with guardrails and an event log
4. **Tier ladder (S2)** with an AI-cost-per-call slider (1 cent threshold)
5. **Local pricing and payment (S3)**: six markets, rails, scores, checkout mocks
6. **Impact calculator**: five levers, presets, per-market table
7. Roadmap, KPI table with phase selector, experiment stop rules
8. Risk matrix with tripwires
9. SWOT and competitor cards
10. About and sources

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest: lever model and guardrail rules
npm run lint
npm run build
```

## Structure

```
src/data/     typed case data (case.ts, levers.ts, plan.ts)
src/lib/      model.ts (lever and market maths), guardrails.ts (offer and test rules)
src/lib/__tests__/   unit tests
src/components/      one component per section
src/app/      layout, page, icon, Open Graph image
```

All computed values (totals, move roll-ups, market revenue, paid-share impact) are derived from the inputs in `src/data`, not hard-coded twice. At defaults the calculator reproduces 54.6 + 26.4 + 12.0 + 18.0 + 9.0 = **$120.0M** (S1 63.6, S2 38.4, S3 18.0; markets sum to $111.0M plus $9.0M free-learner purchases).

## Numbers: sources and assumptions

**Sources:** HCGCC 2026 regional case brief; the case company's Q2 2026 shareholder letter and 10-Q; third-party price trackers for US list prices (verify before relying).

**Team assumptions (estimates, labelled in the UI):** market split of payers and revenue; per-payer prices ($65, $48, $30, $20, $12 a year); programme cost (~$24M) and FTE counts; upside not counted (~$23M) and web-checkout gross profit (~$20M); illustrative tier feature lists; qualitative market scores; KPI targets.

**Derived:** ARPDAU = total bookings / (DAU × 91 days). Base = Q2 2026 revenue $298.5M × 4. Run-rate gross profit = $120M × 72.6% ≈ $87M.

## License

MIT, see [LICENSE](LICENSE).
