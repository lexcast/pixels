import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats ISO currencies", () => {
    expect(formatMoney(1.5, "USD")).toMatch(/1[.,]50/);
    expect(formatMoney(1.5, "USD")).toMatch(/\$|US/);
  });

  it("keeps extra precision when asked", () => {
    expect(formatMoney(0.001, "USD", 4)).toMatch(/0[.,]001/);
  });

  it("falls back for non-ISO units", () => {
    expect(formatMoney(2, "beads")).toBe("2.00 beads");
    expect(formatMoney(2, "")).toBe("2.00");
  });
});
