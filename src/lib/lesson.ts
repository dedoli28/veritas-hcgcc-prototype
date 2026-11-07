import type { Question } from "@/data/course";

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,!?;:"]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Returns whether the learner's answer is correct. `answer` is a string, or the picked word tokens for "build". */
export function isCorrect(q: Question, answer: string | string[]): boolean {
  if (q.type === "build") {
    const a = Array.isArray(answer) ? answer : [];
    return a.length === q.answer.length && a.every((w, i) => w === q.answer[i]);
  }
  const text = Array.isArray(answer) ? answer.join(" ") : answer;
  if (q.type === "type") return q.accepted.some((x) => normalize(x) === normalize(text));
  return normalize(text) === normalize(q.answer);
}

export const correctText = (q: Question): string =>
  q.type === "build" ? q.answer.join(" ") : q.type === "type" ? q.accepted[0] : q.answer;

export const DAILY_GOAL_XP = 20;
export const XP_PER_LESSON = 10;
export const XP_PER_CORRECT = 2;

/** Deterministic shuffle so server and client render the same order. */
export function shuffle<T>(items: T[], seed: number): T[] {
  const a = [...items];
  let s = seed + 1;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
