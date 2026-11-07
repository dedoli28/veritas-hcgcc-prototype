import { describe, expect, it } from "vitest";
import { allLessons } from "@/data/course";
import { isCorrect, normalize, shuffle } from "../lesson";

describe("answer checking", () => {
  it("normalizes case, punctuation and spacing", () => {
    expect(normalize("  Thank   YOU! ")).toBe("thank you");
    expect(normalize("I’m fine.")).toBe("i'm fine");
  });
  it("accepts typed variants", () => {
    const q = allLessons[0].questions.find((x) => x.type === "type")!;
    expect(isCorrect(q, "Thanks!")).toBe(true);
    expect(isCorrect(q, "hello")).toBe(false);
  });
  it("checks word order for build questions", () => {
    const q = allLessons[0].questions.find((x) => x.type === "build")!;
    expect(isCorrect(q, ["My", "name", "is", "Ali"])).toBe(true);
    expect(isCorrect(q, ["name", "My", "is", "Ali"])).toBe(false);
  });
  it("every question has a correct answer inside its options or bank", () => {
    for (const l of allLessons) {
      expect(l.questions.length).toBeGreaterThanOrEqual(6);
      for (const q of l.questions) {
        if (q.type === "choose" || q.type === "blank") expect(q.options).toContain(q.answer);
        if (q.type === "build") q.answer.forEach((w) => expect(q.bank).toContain(w));
      }
    }
  });
  it("shuffle keeps all items", () => {
    expect(shuffle([1, 2, 3, 4, 5], 3).sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
