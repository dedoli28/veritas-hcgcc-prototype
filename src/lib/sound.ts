/** Tiny synthesized sound effects (Web Audio) and speech (Web Speech). No audio files, no network. */

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

/* ---------- Speech ---------- */

export const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

let voices: SpeechSynthesisVoice[] = [];
let voicesBound = false;
// Keep a reference: some mobile browsers garbage-collect an utterance mid-speech and never finish.
let current: SpeechSynthesisUtterance | null = null;

function loadVoices() {
  if (!canSpeak()) return;
  voices = window.speechSynthesis.getVoices();
  if (!voicesBound) {
    voicesBound = true;
    // Android Chrome fills the voice list asynchronously.
    window.speechSynthesis.addEventListener?.("voiceschanged", () => {
      voices = window.speechSynthesis.getVoices();
    });
  }
}

function pickVoice(): SpeechSynthesisVoice | undefined {
  const en = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith("en"));
  return en.find((v) => /^en-us$/i.test(v.lang.replace("_", "-")) && v.localService) ?? en.find((v) => /^en-us$/i.test(v.lang.replace("_", "-"))) ?? en[0];
}

/** Call from a tap handler (for example when opening a lesson) so iOS and Android allow speech later. */
export function unlockSpeech() {
  if (!canSpeak()) return;
  loadVoices();
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}

/**
 * Reads English text aloud. Must be called from a user gesture (tap).
 * `onFail` runs if the device cannot or will not speak (no voice, silent mode, blocked).
 */
export function speak(text: string, slow = false, onFail?: () => void) {
  if (!canSpeak()) {
    onFail?.();
    return;
  }
  const synth = window.speechSynthesis;
  loadVoices();

  const start = () => {
    const u = new SpeechSynthesisUtterance(text);
    current = u;
    const v = pickVoice();
    if (v) {
      u.voice = v;
      u.lang = v.lang;
    } else {
      u.lang = "en-US";
    }
    u.rate = slow ? 0.65 : 1;
    u.pitch = 1;
    u.volume = 1;
    let started = false;
    u.onstart = () => {
      started = true;
    };
    u.onerror = (e) => {
      if (e.error !== "canceled" && e.error !== "interrupted") onFail?.();
    };
    u.onend = () => {
      if (current === u) current = null;
    };
    synth.speak(u);
    // If nothing started shortly after, tell the UI so the lesson is never stuck.
    setTimeout(() => {
      if (!started && !synth.speaking) onFail?.();
    }, 3000);
  };

  if (synth.paused) synth.resume();
  if (synth.speaking || synth.pending) {
    // Cancelling and speaking in the same tick silently fails on Chrome for Android and iOS.
    synth.cancel();
    setTimeout(start, 80);
  } else {
    start();
  }
}
