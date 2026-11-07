export const phases = [
  { id: 1, name: "Prove", window: "Nov 2026 – Jun 2027", costM: 6, fte: "15 FTE", items: ["US, Brazil, Mexico pilots", "Moment offers, Family and Max upsell", "Lite with local rails", "10% holdout in every test"] },
  { id: 2, name: "Scale", window: "Jul – Dec 2027", costM: 9, fte: "25 FTE plus partners", items: ["Roll winners to Canada, UK, Japan, Germany", "Finish Video Call rollout to Super", "Move renewals to web checkout"] },
  { id: 3, name: "Compound", window: "2028", costM: 9, fte: "25 FTE plus partners", items: ["Add India and Indonesia (ad-led, Lite, carrier billing)", "Retire losing cells", "Support the 100M DAU goal"] },
] as const;

export const programmeCostM = 24;
export const programmeMonths = 26;

export const kpiPhases = ["Today (Q2 2026)", "Phase 1 exit (Q2 2027)", "Phase 2 exit (Q4 2027)", "Phase 3 exit (Q4 2028)"] as const;

export const kpis: { name: string; values: [string, string, string, string] }[] = [
  { name: "DAU (DAU/MAU ratio)", values: ["58.7M (42%)", "72M (43%)", "83M (44%)", "100M (45%)"] },
  { name: "ARPDAU change vs prior year", values: ["−12%", "−6%", "0%", "+3%"] },
  { name: "ARPU per payer ($/month)", values: ["$6.70", "≥ $6.50", "≥ $6.50", "≥ $6.50"] },
  { name: "Paid share of monthly users", values: ["9.0%", "9.3%", "9.8%", "10.3%"] },
  { name: "D30 retention, free learners", values: ["Baseline", "≥ control −0.5 pt", "≥ control −0.5 pt", "≥ control −0.5 pt"] },
  { name: "CAC payback, paid channels", values: ["Internal", "≤ 12 months", "≤ 10 months", "≤ 9 months"] },
  { name: "Adjusted EBITDA margin", values: ["25.9%", "≥ 26.5%", "≥ 27.5%", "≥ 29%"] },
  { name: "NPS vs baseline", values: ["Baseline", "Hold", "+3", "+5"] },
];

export const guardrailRules = [
  "At most one offer a week per learner.",
  "Never during a lesson; never blocks progress.",
  "Never on minor profiles; Family purchases are parent-managed.",
  "Always dismissible with no penalty.",
];

export const stopRules = {
  d30Pt: 0.5,
  lessonsPct: 1,
  dismissPct: 60,
  npsPt: 3,
};

export type Level = "High" | "Medium" | "Low";
export const risks: { id: number; name: string; likelihood: Level; impact: Level; mitigation: string; tripwire: string }[] = [
  { id: 1, name: "Free AI assistants substitute for Max", likelihood: "High", impact: "High", mitigation: "Compete on streaks, curriculum, progress, social; keep AI under 1 cent a call and bundle into Super.", tripwire: "Max renewal rate below Super's." },
  { id: 2, name: "Store fees of 15–30% erode margin", likelihood: "High", impact: "Medium", mitigation: "Web checkout where rules allow; push annual plans.", tripwire: "Web checkout under 5% of bookings by Q4 2027." },
  { id: 3, name: "Child-privacy law", likelihood: "Medium", impact: "High", mitigation: "Age-gate every offer, no purchase prompts on minor profiles, legal sign-off per test.", tripwire: "Any offer served to a flagged minor profile." },
  { id: 4, name: "Brand trust after “AI-first” backlash", likelihood: "Medium", impact: "Medium", mitigation: "Say plainly where AI is used, human review of course content, publish learning-outcome evidence.", tripwire: "NPS down 3+ points vs control." },
  { id: 5, name: "Margin squeeze: AI cost and Lite cannibalizing Super", likelihood: "Medium", impact: "Medium", mitigation: "Geo-fence Lite, cap cost per AI call, measure cannibalization in holdouts.", tripwire: "Gross margin under 70% or downgrades to Lite above 10%." },
];
