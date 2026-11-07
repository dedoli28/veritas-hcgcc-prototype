import { describe, expect, it } from "vitest";
import { evaluateOffer, evaluateTest, moments, type LearnerState } from "../guardrails";

const get = (id: string) => moments.find((m) => m.id === id)!;
const fresh: LearnerState = { minor: false, lastOfferDay: null, day: 0 };

describe("evaluateOffer", () => {
  it("shows an offer at an earned moment", () => {
    for (const id of ["streak30", "goal", "exam", "family"]) {
      expect(evaluateOffer(fresh, get(id)).show).toBe(true);
    }
  });

  it("never shows mid-lesson", () => {
    const d = evaluateOffer(fresh, get("midlesson"));
    expect(d.show).toBe(false);
    if (!d.show) expect(d.code).toBe("mid-lesson");
  });

  it("never shows on minor profiles, for any moment", () => {
    for (const m of moments) {
      expect(evaluateOffer({ ...fresh, minor: true }, m).show).toBe(false);
    }
  });

  it("allows at most one offer a week", () => {
    const s = (day: number): LearnerState => ({ minor: false, lastOfferDay: 0, day });
    for (const day of [0, 1, 6]) {
      const d = evaluateOffer(s(day), get("goal"));
      expect(d.show).toBe(false);
      if (!d.show) expect(d.code).toBe("weekly-cap");
    }
    expect(evaluateOffer(s(7), get("goal")).show).toBe(true);
    expect(evaluateOffer(s(10), get("goal")).show).toBe(true);
  });

  it("mid-lesson wins over other reasons", () => {
    const d = evaluateOffer({ minor: true, lastOfferDay: 0, day: 1 }, get("midlesson"));
    if (!d.show) expect(d.code).toBe("mid-lesson");
  });
});

describe("evaluateTest stop rules", () => {
  const ok = { d30DeltaPt: 0, lessonsDeltaPct: 0, dismissRatePct: 30, npsDeltaPt: 0 };
  it("is ok within limits (boundaries are not breaches)", () => {
    expect(evaluateTest(ok).status).toBe("ok");
    expect(evaluateTest({ ...ok, d30DeltaPt: -0.5, lessonsDeltaPct: -1, npsDeltaPt: -3, dismissRatePct: 60 }).status).toBe("ok");
  });
  it("stops on retention, lessons or NPS breach", () => {
    expect(evaluateTest({ ...ok, d30DeltaPt: -0.6 }).status).toBe("stop");
    expect(evaluateTest({ ...ok, lessonsDeltaPct: -1.1 }).status).toBe("stop");
    expect(evaluateTest({ ...ok, npsDeltaPt: -3.1 }).status).toBe("stop");
  });
  it("pauses on dismiss rate above 60%", () => {
    expect(evaluateTest({ ...ok, dismissRatePct: 61 }).status).toBe("pause");
  });
});
