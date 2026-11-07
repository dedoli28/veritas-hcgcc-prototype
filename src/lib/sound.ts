/** Tiny synthesized sound effects (Web Audio). No audio files, no network. */

let ctx: AudioContext | null = null;
let muted = false;

export const isMuted = () => muted;
export const setMuted = (m: boolean) => {
  muted = m;
};

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.18) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  const t = c.currentTime + start;
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export type Sfx = "tap" | "correct" | "wrong" | "complete" | "offer";

export function play(name: Sfx) {
  if (muted) return;
  switch (name) {
    case "tap":
      tone(520, 0, 0.06, "triangle", 0.1);
      break;
    case "correct":
      tone(660, 0, 0.12, "sine");
      tone(880, 0.1, 0.22, "sine");
      break;
    case "wrong":
      tone(220, 0, 0.18, "sawtooth", 0.1);
      tone(165, 0.14, 0.25, "sawtooth", 0.1);
      break;
    case "complete":
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.3, "triangle"));
      break;
    case "offer":
      tone(740, 0, 0.1, "sine", 0.08);
      break;
  }
}

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;

/** Reads English text aloud with the browser's built-in speech synthesis. */
export function speak(text: string, slow = false) {
  if (!canSpeak()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = slow ? 0.6 : 0.95;
  window.speechSynthesis.speak(u);
}
