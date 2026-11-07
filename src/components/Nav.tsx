"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X, Sprout } from "lucide-react";

const links = [
  ["problem", "Problem"],
  ["simulator", "Simulator"],
  ["tiers", "Tiers"],
  ["local", "Local pay"],
  ["impact", "Impact"],
  ["roadmap", "Roadmap"],
  ["risks", "Risks"],
  ["analysis", "Analysis"],
  ["about", "About"],
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const explicit = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(explicit ? explicit === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
        <a href="#top" className="flex min-h-[44px] items-center gap-2 font-extrabold">
          <Sprout aria-hidden="true" className="h-6 w-6 text-primary" />
          Veritas Prototype
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold text-muted hover:bg-surface2 hover:text-fg">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button className="btn !px-3" onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>
            {dark ? <Sun aria-hidden="true" className="h-5 w-5" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
          </button>
          <button
            className="btn !px-3 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <ul id="mobile-menu" className="grid grid-cols-2 gap-1 border-t border-line bg-bg px-4 py-3 sm:px-6 lg:hidden">
          {links.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-semibold hover:bg-surface2"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
