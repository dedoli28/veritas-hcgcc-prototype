"use client";

import { useState } from "react";
import { CalendarPlus, Flame, GraduationCap, RotateCcw, ShieldCheck, ShieldOff, Target, Users, X, BookOpen } from "lucide-react";
import { evaluateOffer, moments, type Moment, type MomentId } from "@/lib/guardrails";
import { guardrailRules } from "@/data/plan";
import { Section } from "./ui";

const icons: Record<MomentId, typeof Flame> = {
  streak30: Flame,
  goal: Target,
  exam: GraduationCap,
  family: Users,
  midlesson: BookOpen,
};

type LogEntry = { id: number; day: number; moment: string; shown: boolean; reason: string };
type Active = { moment: Moment; reason: string } | null;

export default function Simulator() {
  const [day, setDay] = useState(0);
  const [lastOfferDay, setLastOfferDay] = useState<number | null>(null);
  const [minor, setMinor] = useState(false);
  const [view, setView] = useState<"home" | "lesson">("home");
  const [active, setActive] = useState<Active>(null);
  const [toast, setToast] = useState("");
  const [log, setLog] = useState<LogEntry[]>([]);

  const push = (e: Omit<LogEntry, "id">) => setLog((l) => [{ ...e, id: l.length + 1 }, ...l]);

  const trigger = (m: Moment) => {
    setToast("");
    setView(m.inLesson ? "lesson" : "home");
    const d = evaluateOffer({ minor, lastOfferDay, day }, m);
    push({ day, moment: m.button, shown: d.show, reason: d.reason });
    if (d.show) {
      setActive({ moment: m, reason: d.reason });
      setLastOfferDay(day);
    } else {
      setActive(null);
      setToast(d.reason);
    }
  };

  const dismiss = () => {
    if (active) push({ day, moment: active.moment.button, shown: true, reason: "Dismissed with no penalty. Learning continues." });
    setActive(null);
  };
  const accept = () => {
    if (active) push({ day, moment: active.moment.button, shown: true, reason: "Accepted (demo only: nothing is purchased)." });
    setActive(null);
    setToast("Demo only: nothing was purchased or collected.");
  };
  const reset = () => {
    setDay(0);
    setLastOfferDay(null);
    setView("home");
    setActive(null);
    setToast("");
    setLog([]);
  };

  const offer = active?.moment.offer;

  return (
    <Section
      id="simulator"
      eyebrow="2 · Solution S1 · Convert at moments of value"
      title="Moment-of-value simulator"
      intro="Trigger a moment and watch the guardrails decide. The app below is our own generic design. Offers appear only at earned moments, never mid-lesson, never on minor profiles, and at most once a week."
    >
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        {/* Phone */}
        <div className="mx-auto w-full max-w-[340px]">
          <div className="rounded-[2.5rem] border-[10px] border-fg/80 bg-surface p-0 shadow-lg" aria-label="Phone mock of a generic language-learning app" role="group">
            <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[1.8rem] bg-bg">
              <div className="flex items-center justify-between bg-primary px-4 py-3 text-onprimary">
                <span className="font-bold">Sample Language App</span>
                <span className="flex items-center gap-1 text-sm font-bold">
                  <Flame aria-hidden="true" className="h-4 w-4" /> 30
                </span>
              </div>

              {view === "home" ? (
                <div className="flex-1 space-y-3 p-4">
                  <p className="text-sm font-semibold text-muted">Day {day} of the simulation</p>
                  <div className="rounded-xl border border-line bg-surface p-3">
                    <p className="font-bold">Daily goal</p>
                    <div className="mt-2 h-3 w-full rounded-full bg-surface2" role="progressbar" aria-label="Daily goal progress" aria-valuenow={70} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-3 w-[70%] rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-line bg-surface p-3">
                    <p className="font-bold">Unit 4 · Ordering food</p>
                    <p className="text-sm text-muted">Lesson 3 of 5</p>
                  </div>
                  <p className="text-sm text-muted">Pick a moment on the right. Your decision appears in the event log.</p>
                </div>
              ) : (
                <div className="flex-1 space-y-3 p-4" aria-live="polite">
                  <p className="text-sm font-semibold text-muted">Lesson in progress · question 3 of 8</p>
                  <div className="rounded-xl border border-line bg-surface p-4">
                    <p className="font-bold">Translate: “I would like some water.”</p>
                    <div className="mt-3 grid gap-2">
                      {["Quisiera un poco de agua", "Tengo un perro", "¿Dónde está el baño?"].map((o) => (
                        <span key={o} className="rounded-lg border border-line px-3 py-2 text-sm">
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="rounded-lg bg-psoft p-3 text-sm font-semibold">No offers here. Lessons are never interrupted.</p>
                  <button className="btn w-full" onClick={() => setView("home")}>
                    Back to home
                  </button>
                </div>
              )}

              {offer && (
                <div className="absolute inset-x-3 bottom-3 rounded-2xl border-2 border-primary bg-surface p-4 shadow-xl" role="dialog" aria-label="Optional offer">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-extrabold">{offer.title}</h3>
                    <button onClick={dismiss} className="-m-2 rounded-lg p-2" aria-label="Dismiss offer">
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-muted">{offer.body}</p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn btn-primary flex-1 !px-2" onClick={accept}>
                      {offer.cta}
                    </button>
                    <button className="btn flex-1 !px-2" onClick={dismiss}>
                      Not now
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-muted">One tap. Dismiss any time, no penalty. Illustrative copy.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls + log */}
        <div className="space-y-5">
          <div className="card">
            <h3 className="text-lg font-bold">Trigger a moment</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {moments.map((m) => {
                const Icon = icons[m.id];
                return (
                  <button key={m.id} className="btn" onClick={() => trigger(m)}>
                    <Icon aria-hidden="true" className="h-4 w-4" /> {m.button}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button className="btn" onClick={() => setDay((d) => d + 1)}>
                <CalendarPlus aria-hidden="true" className="h-4 w-4" /> +1 day
              </button>
              <button className="btn" onClick={() => setDay((d) => d + 7)}>
                <CalendarPlus aria-hidden="true" className="h-4 w-4" /> +7 days
              </button>
              <button className="btn" role="switch" aria-checked={minor} onClick={() => setMinor((v) => !v)}>
                {minor ? <ShieldOff aria-hidden="true" className="h-4 w-4" /> : <ShieldCheck aria-hidden="true" className="h-4 w-4" />}
                Minor profile: {minor ? "on" : "off"}
              </button>
              <button className="btn" onClick={reset}>
                <RotateCcw aria-hidden="true" className="h-4 w-4" /> Reset
              </button>
            </div>
            <p className="mt-3 text-base font-semibold" aria-live="polite">
              Simulated day: {day}. Last offer: {lastOfferDay === null ? "none yet" : `day ${lastOfferDay}`}.
            </p>
            {toast && (
              <p className="mt-2 rounded-lg bg-wsoft p-3 text-base font-semibold text-warn" role="status">
                {toast}
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-lg font-bold">Guardrails enforced</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-muted">
              {guardrailRules.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold">Event log</h3>
            {log.length === 0 ? (
              <p className="mt-2 text-base text-muted">No events yet. Try “Complete a 30-day streak”, then “Finish a goal” to see the weekly cap.</p>
            ) : (
              <ol className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1" aria-live="polite">
                {log.map((e) => (
                  <li key={e.id} className="rounded-lg border border-line p-3 text-base">
                    <span className={`chip ${e.shown ? "!bg-psoft" : "!bg-wsoft"}`}>{e.shown ? "Offer" : "Suppressed"}</span>{" "}
                    <strong>Day {e.day} · {e.moment}</strong>
                    <p className="text-muted">{e.reason}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
