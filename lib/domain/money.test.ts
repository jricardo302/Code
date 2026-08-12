import { describe, expect, it } from "vitest";
import {
  applyBasisPoints,
  formatCents,
  fromDecimalString,
  multiplyCents,
  percentToBasisPoints,
  sumCents,
  toDecimalString,
} from "./money";

describe("applyBasisPoints", () => {
  it("computes 7% turnover tax exactly", () => {
    expect(applyBasisPoints(100_000, 700)).toBe(7_000); // $1000.00 -> $70.00
    expect(applyBasisPoints(199_500, 700)).toBe(13_965); // $1995.00 -> $139.65
  });

  it("rounds half up on the cent", () => {
    expect(applyBasisPoints(1, 700)).toBe(0); // 0.07 ct
    expect(applyBasisPoints(7, 700)).toBe(0); // 0.49 ct
    expect(applyBasisPoints(8, 700)).toBe(1); // 0.56 ct
    expect(applyBasisPoints(50, 1_000)).toBe(5); // exactly on the cent
    expect(applyBasisPoints(5, 5_000)).toBe(3); // 2.5 ct -> half up
  });

  it("never exhibits float drift", () => {
    // The classic: 0.1 + 0.2 territory. 2875 * 0.07 = 201.24999... as floats.
    for (let cents = 0; cents < 10_000; cents++) {
      const viaInts = applyBasisPoints(cents, 700);
      const exact = (cents * 700) / 10_000;
      expect(Math.abs(viaInts - exact)).toBeLessThanOrEqual(0.5);
      expect(Number.isSafeInteger(viaInts)).toBe(true);
    }
  });

  it("refuses non-integer input instead of guessing", () => {
    expect(() => applyBasisPoints(10.5, 700)).toThrow(TypeError);
    expect(() => applyBasisPoints(1000, 7.5)).toThrow(RangeError);
    expect(() => applyBasisPoints(1000, -1)).toThrow(RangeError);
  });
});

describe("integer guards", () => {
  it("multiplies and sums only integers", () => {
    expect(multiplyCents(28_500, 7)).toBe(199_500);
    expect(sumCents([28_500, 28_500, 15_000])).toBe(72_000);
    expect(() => multiplyCents(28_500.5, 7)).toThrow(TypeError);
    expect(() => sumCents([1, 2.5])).toThrow(TypeError);
    expect(() => multiplyCents(100, -1)).toThrow(RangeError);
  });
});

describe("decimal strings for payment providers", () => {
  it("round-trips", () => {
    expect(toDecimalString(199_500)).toBe("1995.00");
    expect(toDecimalString(5)).toBe("0.05");
    expect(toDecimalString(0)).toBe("0.00");
    expect(toDecimalString(-2_50)).toBe("-2.50");
    expect(fromDecimalString("1995.00")).toBe(199_500);
    expect(fromDecimalString("0.05")).toBe(5);
    expect(fromDecimalString("12.3")).toBe(12_30);
    expect(fromDecimalString("12")).toBe(12_00);
  });

  it("rejects garbage", () => {
    expect(() => fromDecimalString("12,50")).toThrow(TypeError);
    expect(() => fromDecimalString("12.345")).toThrow(TypeError);
    expect(() => fromDecimalString("")).toThrow(TypeError);
    expect(() => fromDecimalString("abc")).toThrow(TypeError);
  });
});

describe("percent and formatting", () => {
  it("converts percentages", () => {
    expect(percentToBasisPoints(7)).toBe(700);
    expect(percentToBasisPoints(30)).toBe(3_000);
    expect(percentToBasisPoints(0.5)).toBe(50);
  });

  it("formats for display without touching the stored amount", () => {
    // Exact string depends on ICU, but the digits must be right.
    expect(formatCents(199_500, { locale: "en-US", currency: "USD" })).toContain("1,995.00");
    expect(formatCents(199_500)).toContain("1.995,00");
  });
});
