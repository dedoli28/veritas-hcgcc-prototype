"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Check, Crown, FlaskConical, Flame, Lock, Moon, Star, Sun, Trophy, User, X } from "lucide-react";
import { units, allLessons, type Lesson } from "@/data/course";
import { markets } from "@/data/levers";
import { FOOTER_TEXT } from "@/data/case";
import { evaluateOffer, moments, type Moment, type MomentId } from "@/lib/guardrails";
import { DAILY_GOAL_XP, XP_PER_CORRECT, XP_PER_LESSON } from "@/lib/lesson";
import { flows, FakeQr } from "@/components/LocalPricing";
import LessonPlayer, { type LessonResult } from "./LessonPlayer";

type Tab = "learn" | "plans" | "profile";
type Log = { id: number; day: number; text: string; shown: boolean };
type Done = { result: LessonResult; gained: number; pending: MomentId | null; lesson: Lesson };

const tiers = [
  { id: "lite", name: "Super Lite", blurb: "Ad-supported entry point in local-price markets", perks: ["Ads between lessons", "Core lessons stay free"] },
  { id: "super", name: "Super", blurb: "The core paid plan", perks: ["No ads", "AI practice included", "Video Call as AI cost falls"] },
  { id: "max", name: "Max", blurb: "Premium AI practice", perks: ["Everything in Super", "Extended AI speaking practice", "Video Call"] },
  { id: "family", name: "Family", blurb: "One plan for the household", perks: ["Super features for family members", "Managed by a parent"] },
];

export default function LearnerApp() {
  const [tab, setTab] = useState<Tab>("learn");
  const [dark, setDark] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(12);
  const [doneToday, setDoneToday] = useState(false);
  const [day, setDay] = useState(0);
  const [lastOfferDay, setLastOfferDay] = useState<number | null>(null);
  const [minor, setMinor] = useState(false);
  const [exam, setExam] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const [offer, setOffer] = useState<Moment | null>(null);
  const [toast, setToast] = useState("");
  const [log, setLog] = useState<Log[]>([]);
  const [demo, setDemo] = useState(false);
  const [highlight, setHighlight] = useState("");
  const [checkout, setCheckout] = useState<string | null>(null);
  const [market, setMarket] = useState(markets[1].id);
  const [step, setStep] = useState(0);

  const goalPct = Math.min(100, (xp / DAILY_GOAL_XP) * 100);

  const toggleTheme = () => {
    const isDark = dark ?? window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = isDark ? "light" : "dark";
    setDark(!isDark);
  };

  const fire = (id: MomentId) => {
    const m = moments.find((x) => x.id === id)!;
    const d = evaluateOffer({ minor, lastOfferDay, day }, m);
    setLog((l) => [{ id: l.length + 1, day, text: `${m.button}: ${d.reason}`, shown: d.show }, ...l]);
    if (d.show) {
      setOffer(m);
      setLastOfferDay(day);
      setToast("");
    } else {
      setToast(d.reason);
    }
  };

  const finish = (result: LessonResult) => {
    const gained = XP_PER_LESSON + result.correct * XP_PER_CORRECT;
    const newXp = xp + gained;
    let pending: MomentId | null = null;
    if (!doneToday) {
      setDoneToday(true);
      const ns = streak + 1;
      setStreak(ns);
      if (ns === 30) pending = "streak30";
    }
    if (!pending && xp < DAILY_GOAL_XP && newXp >= DAILY_GOAL_XP) pending = "goal";
    setXp(newXp);
    setCompleted((c) => new Set(c).add(lesson!.id));
    setDone({ result, gained, pending, lesson: lesson! });
    setLesson(null);
  };

  const closeResults = () => {
    const p = done?.pending ?? null;
    setDone(null);
    if (p) fire(p);
  };

  const accept = () => {
    const kind = offer?.offer?.kind;
    setOffer(null);
    if (kind === "upgrade" || kind === "family") {
      setHighlight(kind === "family" ? "family" : "max");
      setTab("plans");
    } else {
      setToast("Demo only: nothing was purchased or collected.");
    }
  };

  const nextDay = (n: number) => {
    setDay((d) => d + n);
    setDoneToday(false);
    setXp(0);
  };

  const firstOpen = allLessons.find((l) => !completed.has(l.id))?.id;

  if (lesson) return <LessonPlayer lesson={lesson} onExit={() => setLesson(null)} onFinish={finish} />;

  if (done) {
    const pct = Math.round((done.result.correct / done.result.total) * 100);
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-5 px-4 text-center">
        <Trophy aria-hidden="true" className="h-20 w-20 text-accent" />
        <h1 className="text-3xl font-extrabold">Lesson complete!</h1>
        <p className="text-lg text-muted">{done.lesson.title}</p>
        <div className="grid w-full grid-cols-3 gap-3">
          <div className="card !p-3"><p className="text-sm font-bold text-muted">XP</p><p className="text-2xl font-extrabold text-primary">+{done.gained}</p></div>
          <div className="card !p-3"><p className="text-sm font-bold text-muted">Correct</p><p className="text-2xl font-extrabold">{done.result.correct}/{done.result.total}</p></div>
          <div className="card !p-3"><p className="text-sm font-bold text-muted">Accuracy</p><p className="text-2xl font-extrabold">{pct}%</p></div>
        </div>
        <p className="flex items-center gap-2 text-lg font-bold"><Flame aria-hidden="true" className="h-5 w-5 text-accent" /> {streak}-day streak</p>
        <button className="btn btn-primary w-full !min-h-[52px] text-lg" onClick={closeResults} autoFocus>Continue</button>
      </div>
    );
  }

  const tabs: [Tab, string, typeof BookOpen][] = [["learn", "Learn", BookOpen], ["plans", "Plans", Crown], ["profile", "Profile", User]];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-2">
          <span className="font-brand text-xl text-primary">Veritas English</span>
          <div className="flex items-center gap-3 text-base font-bold">
            <span className="flex items-center gap-1" aria-label={`${streak} day streak`}><Flame aria-hidden="true" className="h-5 w-5 text-accent" />{streak}</span>
            <span className="flex items-center gap-1" aria-label={`${xp} XP today`}><Star aria-hidden="true" className="h-5 w-5 text-accent" />{xp}</span>
            <button className="btn !min-h-[40px] !px-2" onClick={toggleTheme} aria-label="Toggle theme">
              {dark ? <Sun aria-hidden="true" className="h-4 w-4" /> : <Moon aria-hidden="true" className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-32 pt-5">
        {toast && (
          <p className="mb-4 flex items-start justify-between gap-2 rounded-xl bg-wsoft p-3 text-base font-semibold text-warn" role="status">
            <span>{toast}</span>
            <button onClick={() => setToast("")} aria-label="Dismiss message"><X aria-hidden="true" className="h-5 w-5" /></button>
          </p>
        )}

        {tab === "learn" && (
          <>
            <div className="card mb-6">
              <p className="text-base font-bold">Daily goal: {Math.min(xp, DAILY_GOAL_XP)}/{DAILY_GOAL_XP} XP</p>
              <div className="mt-2 h-3 rounded-full bg-surface2" role="progressbar" aria-label="Daily goal" aria-valuemin={0} aria-valuemax={DAILY_GOAL_XP} aria-valuenow={Math.min(xp, DAILY_GOAL_XP)}>
                <div className="h-3 rounded-full bg-primary" style={{ width: `${goalPct}%` }} />
              </div>
            </div>
            {units.map((u) => (
              <section key={u.id} className="mb-8" aria-label={`${u.title}: ${u.subtitle}`}>
                <div className="rounded-2xl p-4 text-white" style={{ background: u.color === "var(--c2)" ? "#a16207" : u.color === "var(--c3)" ? "#0f766e" : "#15803d" }}>
                  <p className="text-sm font-bold uppercase opacity-90">{u.title}</p>
                  <h2 className="text-xl font-extrabold">{u.subtitle}</h2>
                </div>
                <ol className="mt-4 flex flex-col items-center gap-4">
                  {u.lessons.map((l, i) => {
                    const isDone = completed.has(l.id);
                    const open = isDone || l.id === firstOpen;
                    return (
                      <li key={l.id} className="flex flex-col items-center" style={{ transform: `translateX(${i % 2 ? 36 : -36}px)` }}>
                        <button
                          disabled={!open}
                          onClick={() => setLesson(l)}
                          aria-label={`${l.title}${isDone ? " (completed)" : open ? "" : " (locked)"}`}
                          className={`flex h-20 w-20 items-center justify-center rounded-full border-b-8 text-onprimary ${isDone ? "border-black/25 bg-accent !text-onaccent" : open ? "border-black/25 bg-primary" : "border-line bg-surface2 !text-muted"}`}
                        >
                          {isDone ? <Check aria-hidden="true" className="h-9 w-9" /> : open ? <Star aria-hidden="true" className="h-9 w-9" /> : <Lock aria-hidden="true" className="h-8 w-8" />}
                        </button>
                        <span className="mt-1 text-base font-bold">{l.title}</span>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}
          </>
        )}

        {tab === "plans" && (
          <>
            <h1 className="text-2xl font-extrabold">Plans</h1>
            <p className="text-base text-muted">Illustrative tiers. Lessons stay free; upgrades are always optional.</p>
            <div className="mt-4 grid gap-3">
              {tiers.map((t) => (
                <article key={t.id} className={`card ${highlight === t.id ? "!border-primary ring-2 ring-primary" : ""}`}>
                  <h2 className="text-xl font-extrabold">{t.name}</h2>
                  <p className="text-base text-muted">{t.blurb}</p>
                  <ul className="mt-2 list-disc pl-5 text-base">{t.perks.map((p) => <li key={p}>{p}</li>)}</ul>
                  <button className="btn btn-primary mt-3" onClick={() => { setCheckout(t.name); setStep(0); }}>Choose {t.name}</button>
                </article>
              ))}
            </div>
          </>
        )}

        {tab === "profile" && (
          <>
            <h1 className="text-2xl font-extrabold">Profile</h1>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="card !p-3"><p className="text-sm font-bold text-muted">Streak</p><p className="text-2xl font-extrabold">{streak} days</p></div>
              <div className="card !p-3"><p className="text-sm font-bold text-muted">Lessons done</p><p className="text-2xl font-extrabold">{completed.size}/{allLessons.length}</p></div>
            </div>
            <div className="card mt-4 space-y-4">
              <button className="btn w-full justify-between" role="switch" aria-checked={minor} onClick={() => setMinor((v) => !v)}>
                Learner is under 18 <span>{minor ? "On" : "Off"}</span>
              </button>
              <p className="text-sm text-muted">Minor profiles never see purchase offers. Family purchases are parent-managed.</p>
              <div>
                <label htmlFor="exam" className="text-base font-bold">Exam date (optional)</label>
                <input id="exam" type="date" value={exam} onChange={(e) => { setExam(e.target.value); if (e.target.value) fire("exam"); }} className="mt-1 w-full rounded-xl border-2 border-line bg-surface p-3 text-base" />
              </div>
              <button className="btn w-full" onClick={() => fire("family")}>Open a Family invite</button>
            </div>
            <p className="mt-6 text-base"><Link href="/case" className="font-semibold text-primary underline">See the case analysis and impact model</Link></p>
          </>
        )}
      </main>

      <footer className="border-t border-line bg-surface2 px-4 py-4 pb-24 text-center text-sm text-muted">{FOOTER_TEXT}</footer>

      <nav aria-label="App" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface">
        <ul className="mx-auto flex max-w-2xl">
          {tabs.map(([id, label, Icon]) => (
            <li key={id} className="flex-1">
              <button onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined} className={`flex min-h-[56px] w-full flex-col items-center justify-center text-sm font-bold ${tab === id ? "text-primary" : "text-muted"}`}>
                <Icon aria-hidden="true" className="h-6 w-6" /> {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button className="btn fixed bottom-20 right-3 z-30 shadow-lg" onClick={() => setDemo(true)} aria-label="Open demo controls">
        <FlaskConical aria-hidden="true" className="h-4 w-4" /> Demo
      </button>

      {offer?.offer && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="Optional offer">
          <div className="w-full max-w-md rounded-3xl bg-surface p-5">
            <h2 className="text-xl font-extrabold">{offer.offer.title}</h2>
            <p className="mt-1 text-base text-muted">{offer.offer.body}</p>
            <div className="mt-4 grid gap-2">
              <button className="btn btn-primary !min-h-[48px]" onClick={accept}>{offer.offer.cta}</button>
              <button className="btn !min-h-[48px]" onClick={() => setOffer(null)} autoFocus>Not now</button>
            </div>
            <p className="mt-2 text-sm text-muted">One tap, dismissible, no penalty. Shown once a week at most.</p>
          </div>
        </div>
      )}

      {checkout && (() => {
        const m = markets.find((x) => x.id === market)!;
        const flow = flows[m.checkout];
        const last = step === flow.steps.length - 1;
        return (
          <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-3 sm:items-center" role="dialog" aria-modal="true" aria-label="Checkout mock">
            <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-surface p-5">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-extrabold">{checkout}: checkout mock</h2>
                <button onClick={() => setCheckout(null)} aria-label="Close checkout"><X aria-hidden="true" className="h-6 w-6" /></button>
              </div>
              <p className="text-sm text-muted">No real payment, nothing collected.</p>
              <label htmlFor="mk" className="mt-3 block text-base font-bold">Your market</label>
              <select id="mk" value={market} onChange={(e) => { setMarket(e.target.value); setStep(0); }} className="mt-1 w-full rounded-xl border-2 border-line bg-surface p-3 text-base">
                {markets.map((x) => <option key={x.id} value={x.id}>{x.name} ({x.rail})</option>)}
              </select>
              <ol className="mt-3 space-y-2">
                {flow.steps.map((s, i) => (
                  <li key={s} className={`rounded-lg border p-3 text-base ${i === step ? "border-primary bg-psoft font-semibold" : "border-line text-muted"}`}>{i + 1}. {s}</li>
                ))}
              </ol>
              {m.checkout === "pix" && step === 1 && <div className="mt-3"><FakeQr /></div>}
              {m.checkout === "oxxo" && step === 1 && <p className="mt-3 rounded-lg border border-dashed border-line p-2 font-mono text-base">DEMO 0000 0000 0000</p>}
              {last ? <p className="mt-3 font-bold text-primary" role="status">Done (simulated). Nothing was charged.</p> : <button className="btn btn-primary mt-3 w-full" onClick={() => setStep(step + 1)}>Next step</button>}
            </div>
          </div>
        );
      })()}

      {demo && (
        <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto border-l border-line bg-surface p-4 shadow-2xl" aria-label="Demo controls">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">Demo controls</h2>
            <button onClick={() => setDemo(false)} aria-label="Close demo controls"><X aria-hidden="true" className="h-6 w-6" /></button>
          </div>
          <p className="mt-1 text-sm text-muted">Simulated day {day}. Last offer: {lastOfferDay === null ? "none" : `day ${lastOfferDay}`}.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn" onClick={() => nextDay(1)}>+1 day</button>
            <button className="btn" onClick={() => nextDay(7)}>+7 days</button>
            <button className="btn" role="switch" aria-checked={minor} onClick={() => setMinor((v) => !v)}>Minor profile: {minor ? "on" : "off"}</button>
            <button className="btn" onClick={() => { setStreak(30); setDemo(false); fire("streak30"); }}>Reach a 30-day streak</button>
            <button className="btn" onClick={() => fire("midlesson")}>Try an offer mid-lesson</button>
            <button className="btn" onClick={() => { setLastOfferDay(null); setLog([]); }}>Reset offers</button>
          </div>
          <h3 className="mt-5 font-bold">Guardrail log</h3>
          {log.length === 0 ? <p className="text-sm text-muted">Nothing yet. Finish a lesson or use the buttons above.</p> : (
            <ol className="mt-2 space-y-2">
              {log.map((e) => (
                <li key={e.id} className="rounded-lg border border-line p-2 text-sm"><strong>{e.shown ? "Offer" : "Suppressed"} · day {e.day}</strong><br />{e.text}</li>
              ))}
            </ol>
          )}
        </aside>
      )}
    </div>
  );
}
