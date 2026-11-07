/** Case facts (Q2 2026). Source: HCGCC 2026 regional case brief; Q2 2026 shareholder letter / 10-Q. */

export const FOOTER_TEXT =
  "Concept prototype by Team Veritas, Pertevniyal Highschool, for HCGCC 2026. Not affiliated with Duolingo. All projections are team estimates.";

export const baseFacts = {
  dauM: 58.7,
  dauGrowthPct: 23,
  mauM: 140.6,
  payersM: 12.7,
  paidSharePct: 9.0,
  bookingsM: 289.1,
  bookingsGrowthPct: 8,
  revenueM: 298.5,
  revenueGrowthPct: 18,
  subscriptionBookingsGrowthPct: 10,
  arpdauPrev: 0.062,
  arpdauNow: 0.054,
  arpdauChangePct: -12,
  listPrice: 13.49,
  realizedPrice: 6.7,
  adjEbitdaMarginPct: 25.9,
  grossMarginPct: 72.6,
  dauMauPct: 42,
  dauGoalM: 100,
  daysInQuarter: 91,
} as const;

/** Annualised revenue base: Q2 2026 revenue x 4 ($M). */
export const annualBaseM = baseFacts.revenueM * 4;

export type Problem = {
  id: string;
  title: string;
  headline: string;
  value: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  evidence: string;
};

export const problems: Problem[] = [
  {
    id: "P1",
    title: "Too few users pay",
    headline: "of monthly users pay",
    value: 9.0,
    decimals: 1,
    suffix: "%",
    evidence:
      "One extra point of paid share is about 1.4M subscribers, worth $91–114M a year.",
  },
  {
    id: "P2",
    title: "Revenue per daily user is falling",
    headline: "ARPDAU, year over year",
    value: -12,
    decimals: 0,
    suffix: "%",
    evidence:
      "ARPDAU fell from $0.062 to $0.054 a day as DAU grew +23% but bookings only +8%.",
  },
  {
    id: "P3",
    title: "Each payer keeps about half of list price",
    headline: "of list price realized",
    value: 50,
    decimals: 0,
    prefix: "~",
    suffix: "%",
    evidence:
      "About $6.70 a month realized vs about $13.49 list (midpoint of $12.99–13.99).",
  },
];

export const growthBars = [
  { name: "DAU", value: 23 },
  { name: "Subscription bookings", value: 10 },
  { name: "Total bookings", value: 8 },
  { name: "Revenue", value: 18 },
];

export const priceCauses = [
  "Half of bookings sit in local-price markets",
  "Family and annual plans trade price for retention",
  "App stores keep 15–30%",
];

export const strengths = [
  "Habit engine: 42% of monthly users play daily",
  "Brand and proprietary learner data",
  "AI teaching stack",
  "English Test accepted by 3,100+ US institutions",
];
export const weaknesses = [
  "Users grow faster than dollars (ARPDAU −12%)",
  "Only 9.0% of monthly users pay",
  "Realized price is about half of list price",
  "Revenue lags bookings (subscriptions recognized over ~12 months)",
];
export const opportunities = [
  "Earned-moment offers convert without friction",
  "A clearer tier ladder (Lite, Super, Max, Family)",
  "Local pricing and local payment rails",
  "100M DAU goal by 2028 widens the base",
];
export const threats = [
  "Free AI assistants (ChatGPT, Gemini) with unlimited speaking practice",
  "Child-privacy laws (COPPA, Texas SCOPE Act)",
  "“AI-first” brand backlash",
  "Platform terms and store fees",
];

export const competitors = [
  {
    name: "Babbel",
    threat: "Structured paid courses for adults who already want to pay.",
    answer:
      "Keep the daily habit free and earn the upgrade at moments of value, so we out-reach paid-first rivals.",
  },
  {
    name: "Preply",
    threat: "Human tutors for serious speaking practice.",
    answer:
      "Offer Video Call and Max AI practice at a lower cost per session, with Family as the retention anchor.",
  },
  {
    name: "Free AI assistants",
    threat: "Unlimited speaking practice at zero price.",
    answer:
      "Compete on streaks, curriculum, progress and social. Keep AI under 1 cent a call and bundle it into Super.",
  },
];

export const sources = [
  "HCGCC 2026 regional case brief",
  "Duolingo Q2 2026 shareholder letter and Form 10-Q (the case company)",
  "Third-party price trackers for US list prices (verify before relying)",
];

export const assumptions = [
  "Market split of payers and revenue",
  "Prices per payer in the lever model ($65, $48, $30, $20, $12 a year)",
  "Programme cost ($24M) and FTE counts",
  "Upside not counted in the $120M (~$23M) and web-checkout gross profit (~$20M)",
  "Illustrative tier feature lists and market scores",
];

export const team = {
  name: "Team Veritas",
  school: "Pertevniyal Highschool",
  region: "Middle East, Africa, Russia",
  members: ["Alper Safa Dede", "Yusuf Seza Kılınç", "Uğur Ali Şahinoğlu"],
};
