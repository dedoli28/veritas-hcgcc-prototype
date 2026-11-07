export type MoveId = "S1" | "S2" | "S3";

export type Lever = {
  id: "moment" | "max" | "family" | "lite" | "free";
  label: string;
  move: MoveId;
  volumeM: number; // million payers (or buyers)
  price: number; // $ per payer per year (team assumption)
  step: number;
};

export const levers: Lever[] = [
  { id: "moment", label: "New payers from moment-based offers (Super, Family)", move: "S1", volumeM: 0.84, price: 65, step: 0.01 },
  { id: "max", label: "Max upgrades from Super", move: "S2", volumeM: 0.55, price: 48, step: 0.01 },
  { id: "family", label: "Individual to Family up-mix", move: "S2", volumeM: 0.4, price: 30, step: 0.01 },
  { id: "lite", label: "Super Lite payers (BR, MX, IN, ID)", move: "S3", volumeM: 0.9, price: 20, step: 0.01 },
  { id: "free", label: "Free-learner purchases (cosmetics, streak protection)", move: "S1", volumeM: 0.75, price: 12, step: 0.01 },
];

export const moves: Record<MoveId, { name: string; what: string; solves: string }> = {
  S1: { name: "Convert at moments of value", what: "Earned-moment offers, reverse trials, cosmetic and streak-protection purchases.", solves: "P1" },
  S2: { name: "Tier ladder", what: "Super Lite, Super, Max and Family as rungs; Video Call rolls out to Super.", solves: "P2" },
  S3: { name: "Price and pay locally", what: "PPP price points, local payment rails, web checkout where allowed.", solves: "P3" },
};

export type Market = {
  id: string;
  name: string;
  moment: number;
  max: number;
  family: number;
  lite: number;
  wave: 1 | 2 | 3;
  rail: string;
  railDetail: string;
  tier: string;
  /** user scale, price headroom, conversion gap, payment readiness (1–4) */
  scores: [number, number, number, number];
  checkout: "card" | "pix" | "oxxo" | "upi" | "wallet";
};

export const markets: Market[] = [
  { id: "uscanuk", name: "US, Canada, UK", moment: 0.4, max: 0.35, family: 0.28, lite: 0, wave: 1, rail: "Card", railDetail: "Card and wallets, with web checkout where platform rules allow", tier: "Super, Max, Family", scores: [3, 4, 2, 4], checkout: "card" },
  { id: "brazil", name: "Brazil", moment: 0.12, max: 0.05, family: 0.02, lite: 0.3, wave: 1, rail: "Pix", railDetail: "Instant bank transfer by QR code", tier: "Super Lite, Super", scores: [4, 2, 4, 4], checkout: "pix" },
  { id: "mexico", name: "Mexico", moment: 0.08, max: 0.03, family: 0.01, lite: 0.2, wave: 1, rail: "OXXO", railDetail: "Pay in cash at a store with a voucher code", tier: "Super Lite, Super", scores: [3, 2, 4, 3], checkout: "oxxo" },
  { id: "jpde", name: "Japan, Germany", moment: 0.14, max: 0.1, family: 0.08, lite: 0, wave: 2, rail: "Card and e-wallet", railDetail: "Card plus local e-wallets", tier: "Super, Max, Family", scores: [2, 4, 3, 3], checkout: "wallet" },
  { id: "india", name: "India", moment: 0.05, max: 0.01, family: 0.01, lite: 0.25, wave: 3, rail: "UPI", railDetail: "Instant payment from a bank-linked app, plus carrier billing", tier: "Super Lite (ad-led)", scores: [4, 1, 4, 3], checkout: "upi" },
  { id: "indonesia", name: "Indonesia", moment: 0.05, max: 0.01, family: 0, lite: 0.15, wave: 3, rail: "E-wallet and carrier billing", railDetail: "E-wallet balance or the phone bill", tier: "Super Lite (ad-led)", scores: [4, 1, 4, 2], checkout: "wallet" },
];

export const scoreLabels = ["User scale", "Price headroom", "Conversion gap", "Payment readiness"] as const;

export const freeLearnerBuyers = { volumeM: 0.75, price: 12 };
