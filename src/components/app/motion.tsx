"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/components/ui";

/** Adds `in-view` once the element scrolls into view. */
export function Reveal({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${seen ? "in-view" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Counts to `value` (from `start` on first mount if given) and bounces when it changes. */
export function CountUp({ value, start }: { value: number; start?: number }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(start ?? value);
  const shownRef = useRef(start ?? value);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    const from = shownRef.current;
    if (from === value) return;
    const set = (v: number) => {
      shownRef.current = v;
      setShown(v);
    };
    if (reduced) {
      set(value);
      return;
    }
    let raf = 0;
    let bumped = false;
    const t0 = performance.now();
    const tick = (t: number) => {
      if (!bumped) {
        bumped = true;
        setBump((b) => b + 1);
      }
      const p = Math.min(1, (t - t0) / 400);
      set(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Guarantee the final value even if frames are throttled (hidden tab) or the effect is re-run.
    const done = setTimeout(() => set(value), 450);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(done);
    };
  }, [value, reduced]);

  return (
    <span key={bump} className={`inline-block ${bump ? "m-bump" : ""}`} aria-hidden="true">
      {shown}
    </span>
  );
}

/** Progress bar that fills with transform, and shines once each time it grows. */
export function SmoothBar({ pct, className = "h-3 bg-primary" }: { pct: number; className?: string }) {
  const prev = useRef(pct);
  const [shineKey, setShineKey] = useState(0);
  useEffect(() => {
    if (pct > prev.current) {
      setShineKey((k) => k + 1);
    }
    prev.current = pct;
  }, [pct]);
  return (
    <div key={shineKey} className={`bar-fill shine rounded-full ${shineKey ? "go" : ""} ${className}`} style={{ transform: `scaleX(${Math.max(0, Math.min(1, pct / 100))})`, width: "100%" }} />
  );
}

/** Animated switch. Renders a real button with role=switch. */
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="toggle">
      <span />
    </button>
  );
}

/** Collapses its content smoothly when `show` is false. */
export function Collapse({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div className={`collapse ${show ? "" : "closed"}`} aria-hidden={!show}>
      <div>{children}</div>
    </div>
  );
}

export function CheckDraw({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="m-draw" d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}
