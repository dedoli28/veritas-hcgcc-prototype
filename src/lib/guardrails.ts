import { stopRules } from "@/data/plan";

export type MomentId = "streak30" | "goal" | "exam" | "family" | "midlesson";

export type Moment = {
  id: MomentId;
  button: string;
  inLesson: boolean;
  offer: { kind: "reverse-trial" | "cosmetic" | "upgrade" | "family"; title: string; body: string; cta: string } | null;
};

export const moments: Moment[] = [
  {
    id: "streak30",
    button: "Complete a 30-day streak",
    inLesson: false,
    offer: { kind: "reverse-trial", title: "30 days in a row. Nice.", body: "Try premium with no ads or Energy limits. Your choice, no strings.", cta: "Start reverse trial" },
  },
  {
    id: "goal",
    button: "Finish a goal",
    inLesson: false,
    offer: { kind: "cosmetic", title: "Goal complete!", body: "Want to protect your streak or pick a new look? Optional extras for free learners.", cta: "See extras" },
  },
  {
    id: "exam",
    button: "Set an exam date",
    inLesson: false,
    offer: { kind: "upgrade", title: "Exam on the calendar", body: "Max adds extra speaking practice to prepare. Upgrade only if it helps.", cta: "See Max" },
  },
  {
    id: "family",
    button: "Open Family invite",
    inLesson: false,
    offer: { kind: "family", title: "Learn together", body: "Add family members to one plan. A parent manages the purchase.", cta: "View Family plan" },
  },
  { id: "midlesson", button: "Mid-lesson", inLesson: true, offer: null },
];

export type LearnerState = {
  minor: boolean;
  /** Simulated day number of the last offer shown, or null if none. */
  lastOfferDay: number | null;
  day: number;
};

export type Decision =
  | { show: true; reason: string }
  | { show: false; code: "mid-lesson" | "minor" | "weekly-cap" | "no-offer"; reason: string };

export const WEEKLY_CAP_DAYS = 7;

/** Evaluate guardrails (section 3.6) for a moment. Order: lesson, minor, weekly cap. */
export function evaluateOffer(state: LearnerState, moment: Moment): Decision {
  if (moment.inLesson) {
    return { show: false, code: "mid-lesson", reason: "Suppressed by guardrail: never during a lesson, and never blocks progress." };
  }
  if (state.minor) {
    return { show: false, code: "minor", reason: "Suppressed by guardrail: no purchase offers on minor profiles. Family purchases are parent-managed." };
  }
  if (state.lastOfferDay !== null && state.day - state.lastOfferDay < WEEKLY_CAP_DAYS) {
    const left = WEEKLY_CAP_DAYS - (state.day - state.lastOfferDay);
    return { show: false, code: "weekly-cap", reason: `Suppressed by guardrail: one offer a week (next eligible in ${left} day${left === 1 ? "" : "s"}).` };
  }
  if (!moment.offer) {
    return { show: false, code: "no-offer", reason: "No offer defined for this moment." };
  }
  return { show: true, reason: "Eligible earned moment. One-tap offer shown, dismissible with no penalty." };
}

export type TestMetrics = {
  d30DeltaPt: number; // vs control, negative = worse
  lessonsDeltaPct: number; // vs control, negative = worse
  dismissRatePct: number;
  npsDeltaPt: number; // vs control, negative = worse
};

export type TestVerdict = { status: "ok" | "pause" | "stop"; reasons: string[] };

/** Experiment stop rules (section 3.6). Dismiss rate triggers pause-and-redesign; others stop the test. */
export function evaluateTest(m: TestMetrics): TestVerdict {
  const stops: string[] = [];
  if (m.d30DeltaPt < -stopRules.d30Pt) stops.push("D30 retention more than 0.5 pt below control");
  if (m.lessonsDeltaPct < -stopRules.lessonsPct) stops.push("Lessons completed per DAU more than 1% below control");
  if (m.npsDeltaPt < -stopRules.npsPt) stops.push("NPS more than 3 points below control");
  if (stops.length) return { status: "stop", reasons: stops };
  if (m.dismissRatePct > stopRules.dismissPct) {
    return { status: "pause", reasons: ["Offer dismiss rate above 60%: pause and redesign"] };
  }
  return { status: "ok", reasons: [] };
}
