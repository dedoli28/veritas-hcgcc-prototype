"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import type { Lesson } from "@/data/course";
import { play } from "@/lib/sound";
import { correctText, isCorrect, shuffle } from "@/lib/lesson";

export type LessonResult = { correct: number; total: number };

export default function LessonPlayer({ lesson, onExit, onFinish }: { lesson: Lesson; onExit: () => void; onFinish: (r: LessonResult) => void }) {
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [status, setStatus] = useState<"answering" | "right" | "wrong">("answering");
  const [picked, setPicked] = useState<string>("");
  const [typed, setTyped] = useState("");
  const [words, setWords] = useState<string[]>([]);

  const q = lesson.questions[idx];
  const total = lesson.questions.length;
  const bank = useMemo(() => (q.type === "build" ? shuffle(q.bank, idx + lesson.id.length) : []), [q, idx, lesson.id]);
  const options = useMemo(() => (q.type === "choose" || q.type === "blank" ? shuffle(q.options, idx * 7 + 3) : []), [q, idx]);

  const answer: string | string[] = q.type === "build" ? words : q.type === "type" ? typed : picked;
  const hasAnswer = q.type === "build" ? words.length > 0 : q.type === "type" ? typed.trim().length > 0 : picked !== "";

  const check = () => {
    const ok = isCorrect(q, answer);
    setStatus(ok ? "right" : "wrong");
    play(ok ? "correct" : "wrong");
    if (ok) setCorrect((c) => c + 1);
  };
  const next = () => {
    if (idx + 1 >= total) {
      play("complete");
      onFinish({ correct: correct, total });
      return;
    }
    setIdx(idx + 1);
    setStatus("answering");
    setPicked("");
    setTyped("");
    setWords([]);
  };

  const locked = status !== "answering";

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-2xl flex-col px-4 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="rounded-lg p-2 text-muted hover:bg-surface2" aria-label="Quit lesson">
          <X aria-hidden="true" className="h-6 w-6" />
        </button>
        <div className="h-4 flex-1 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-label="Lesson progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={idx + (status === "answering" ? 0 : 1)}>
          <div className="h-4 rounded-full bg-primary transition-[width]" style={{ width: `${((idx + (status === "answering" ? 0 : 1)) / total) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-muted">{idx + 1}/{total}</span>
      </div>
      <p className="mt-2 text-center text-sm text-muted">Focus mode: offers never appear during a lesson.</p>

      <div className="flex-1 py-6">
        <h2 className="text-2xl font-extrabold">{q.prompt}</h2>

        {q.type === "choose" && (
          <div role="radiogroup" aria-label="Answers" className="mt-6 grid gap-3">
            {options.map((o) => (
              <button key={o} role="radio" aria-checked={picked === o} disabled={locked} onClick={() => { play("tap"); setPicked(o); }} className={`rounded-2xl border-2 border-b-4 p-4 text-left text-lg font-semibold ${picked === o ? "border-primary bg-psoft" : "border-line bg-surface"}`}>
                {o}
              </button>
            ))}
          </div>
        )}

        {q.type === "blank" && (
          <>
            <p className="mt-6 rounded-2xl border-2 border-line bg-surface p-4 text-xl font-semibold">{q.sentence.replace("___", picked ? `[ ${picked} ]` : "_____")}</p>
            <div role="radiogroup" aria-label="Choices" className="mt-4 flex flex-wrap gap-3">
              {options.map((o) => (
                <button key={o} role="radio" aria-checked={picked === o} disabled={locked} onClick={() => { play("tap"); setPicked(o); }} className={`rounded-2xl border-2 border-b-4 px-5 py-3 text-lg font-semibold ${picked === o ? "border-primary bg-psoft" : "border-line bg-surface"}`}>
                  {o}
                </button>
              ))}
            </div>
          </>
        )}

        {q.type === "type" && (
          <>
            <p className="mt-6 rounded-2xl border-2 border-line bg-surface p-4 text-xl font-semibold">{q.source}</p>
            <label className="mt-4 block text-base font-semibold" htmlFor="typed">Your answer in English</label>
            <input id="typed" value={typed} disabled={locked} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && hasAnswer && !locked) check(); }} autoComplete="off" autoCapitalize="off" spellCheck={false} className="mt-1 w-full rounded-2xl border-2 border-line bg-surface p-4 text-lg" placeholder="Type in English" />
          </>
        )}

        {q.type === "build" && (
          <>
            <p className="mt-6 rounded-2xl border-2 border-line bg-surface p-4 text-xl font-semibold">{q.source}</p>
            <div className="mt-4 flex min-h-[64px] flex-wrap gap-2 rounded-2xl border-2 border-dashed border-line p-3" aria-label="Your sentence">
              {words.map((w, i) => (
                <button key={`${w}-${i}`} disabled={locked} onClick={() => setWords(words.filter((_, k) => k !== i))} className="rounded-xl border-2 border-b-4 border-line bg-surface px-3 py-2 text-lg font-semibold">
                  {w}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Word bank">
              {bank.map((w, i) => {
                const used = words.filter((x) => x === w).length >= bank.filter((x) => x === w).length;
                return (
                  <button key={`${w}-${i}`} disabled={locked || used} onClick={() => setWords([...words, w])} className="rounded-xl border-2 border-b-4 border-line bg-surface px-3 py-2 text-lg font-semibold disabled:opacity-40">
                    {w}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div
        className={`-mx-4 border-t-2 px-4 py-4 ${status === "right" ? "border-primary bg-psoft" : status === "wrong" ? "border-danger bg-dsoft" : "border-line"}`}
        role="status"
        aria-live="polite"
      >
        {status === "right" && (
          <p className="mb-3 flex items-center gap-2 text-lg font-extrabold text-primary"><CheckCircle2 aria-hidden="true" className="h-6 w-6" /> Correct!</p>
        )}
        {status === "wrong" && (
          <div className="mb-3 text-danger">
            <p className="flex items-center gap-2 text-lg font-extrabold"><XCircle aria-hidden="true" className="h-6 w-6" /> Not quite</p>
            <p className="text-base font-semibold">Correct answer: {correctText(q)}</p>
          </div>
        )}
        {status === "answering" ? (
          <button className="btn btn-primary w-full !min-h-[52px] text-lg" disabled={!hasAnswer} onClick={check}>Check</button>
        ) : (
          <button className="btn btn-primary w-full !min-h-[52px] text-lg" onClick={next} autoFocus>{idx + 1 >= total ? "Finish lesson" : "Continue"}</button>
        )}
      </div>
    </div>
  );
}
