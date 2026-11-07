"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 id={`${id}-h`} className="mt-1 text-2xl font-extrabold sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 max-w-3xl text-base text-muted sm:text-lg">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

/** Small label that marks a number as a team estimate or assumption. */
export function Est({ children = "estimate", tip }: { children?: string; tip?: string }) {
  return (
    <span
      title={tip ?? "Team estimate or assumption, not a reported figure"}
      className="ml-1 inline-block rounded-md border border-dashed border-line bg-wsoft px-1.5 py-0 align-middle text-sm font-semibold text-warn"
    >
      {children}
    </span>
  );
}

export function Dots({ n, label }: { n: number; label: string }) {
  return (
    <span role="img" aria-label={`${label}: ${n} of 4`} className="inline-flex gap-1">
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`h-3 w-3 rounded-full border border-primary ${i <= n ? "bg-primary" : "bg-transparent"}`}
        />
      ))}
    </span>
  );
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Counts up to `target` once visible. Renders the final value when motion is reduced. */
export function Counter({
  target,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(target);

  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 900;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setVal(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [reduced, target]);

  const shown = reduced ? target : val;
  return (
    <span ref={ref} aria-label={`${prefix}${target.toFixed(decimals)}${suffix}`}>
      <span aria-hidden="true">
        {prefix}
        {shown.toFixed(decimals).replace("-", "−")}
        {suffix}
      </span>
    </span>
  );
}
