import { describe, expect, it } from "vitest";
import { addDays, eachNight, nightsBetween, type CalendarDate } from "./dates";
import { curacaoSeasonsWithIds, DEFAULT_PRICES } from "./curacao-seasons";
import {
  computeQuote,
  foldQuoteLines,
  paymentAmountFor,
  priceNights,
  PricingError,
  requiredMinNights,
  resolveSeasonForNight,
  type PricingPolicy,
  type SeasonRate,
} from "./pricing";

/** The launch policy for Kaya Platio 18: $150 cleaning, 7% OB, 30% deposit. */
const POLICY: PricingPolicy = {
  currency: "USD",
  cleaningFeeCents: 150_00,
  taxRateBps: 700,
  taxOnCleaningFee: true,
  depositBps: 3_000,
  balanceDueDays: 35,
  payInFullWithinDays: 35,
  minNightsFloor: 1,
  maxNights: 90,
};

/** Real Curaçao bands for 2026–2028. */
const SEASONS = curacaoSeasonsWithIds(2026, 2028);

/** A quote long before arrival, so the deposit option is on the table. */
const FAR_OUT = { today: "2026-01-05" satisfies CalendarDate };

describe("season resolution against the Curaçao calendar", () => {
  it.each([
    ["2026-12-15", "high", DEFAULT_PRICES.highCents],
    ["2027-01-01", "high", DEFAULT_PRICES.highCents],
    ["2027-04-15", "high", DEFAULT_PRICES.highCents],
    ["2027-04-16", "shoulder", DEFAULT_PRICES.shoulderCents],
    ["2027-06-30", "shoulder", DEFAULT_PRICES.shoulderCents],
    ["2027-07-01", "low", DEFAULT_PRICES.lowCents],
    ["2027-08-31", "low", DEFAULT_PRICES.lowCents],
    ["2027-09-01", "shoulder", DEFAULT_PRICES.shoulderCents],
    ["2027-12-14", "shoulder", DEFAULT_PRICES.shoulderCents],
  ] as const)("%s prices as %s", (night, _label, cents) => {
    const season = resolveSeasonForNight(SEASONS, night);
    expect(season).not.toBeNull();
    expect(season!.nightlyPriceCents).toBe(cents);
  });

  it("covers every night of 2026–2028 with exactly one winning season", () => {
    for (const night of eachNight("2026-01-01", "2028-12-31")) {
      expect(resolveSeasonForNight(SEASONS, night), night).not.toBeNull();
    }
  });

  it("lets a higher-priority band override high season for a special week", () => {
    const christmas: SeasonRate = {
      id: "xmas",
      label: "Kerstweek",
      startDate: "2026-12-24",
      endDate: "2026-12-31",
      nightlyPriceCents: 350_00,
      minNights: 7,
      priority: 20,
    };
    expect(resolveSeasonForNight([...SEASONS, christmas], "2026-12-25")?.id).toBe("xmas");
    expect(resolveSeasonForNight([...SEASONS, christmas], "2026-12-23")?.id).not.toBe("xmas");
  });

  it("breaks priority ties toward the band that starts later", () => {
    const wide: SeasonRate = {
      id: "wide",
      label: "Wide",
      startDate: "2027-01-01",
      endDate: "2027-12-31",
      nightlyPriceCents: 100_00,
      minNights: 1,
      priority: 5,
    };
    const narrow: SeasonRate = {
      id: "narrow",
      label: "Narrow",
      startDate: "2027-06-01",
      endDate: "2027-06-30",
      nightlyPriceCents: 200_00,
      minNights: 1,
      priority: 5,
    };
    expect(resolveSeasonForNight([wide, narrow], "2027-06-15")?.id).toBe("narrow");
    expect(resolveSeasonForNight([narrow, wide], "2027-06-15")?.id).toBe("narrow");
  });
});

describe("minimum stay", () => {
  it("requires 5 nights in high season and 3 otherwise", () => {
    expect(requiredMinNights(SEASONS, "2027-01-10", "2027-01-15", 1)).toBe(5);
    expect(requiredMinNights(SEASONS, "2027-07-10", "2027-07-13", 1)).toBe(3);
    expect(requiredMinNights(SEASONS, "2027-05-10", "2027-05-13", 1)).toBe(3);
  });

  it("applies the strictest rule when a stay straddles a boundary", () => {
    // 14–17 Dec 2027: two shoulder nights, one high night -> 5 required.
    expect(requiredMinNights(SEASONS, "2027-12-13", "2027-12-16", 1)).toBe(5);
  });

  it("rejects a too-short stay with the exact requirement in the error", () => {
    expect.assertions(2);
    try {
      computeQuote(POLICY, SEASONS, { arrivalDate: "2027-01-10", departureDate: "2027-01-13" }, FAR_OUT);
    } catch (e) {
      expect(e).toBeInstanceOf(PricingError);
      expect((e as PricingError).code).toBe("MIN_NIGHTS_NOT_MET");
    }
  });

  it("never drops below the property floor", () => {
    expect(requiredMinNights([], "2027-05-10", "2027-05-12", 2)).toBe(2);
  });
});

describe("computeQuote — the reference stays", () => {
  it("prices a plain 7-night high-season week to the cent", () => {
    const quote = computeQuote(
      POLICY,
      SEASONS,
      { arrivalDate: "2027-01-10", departureDate: "2027-01-17" },
      FAR_OUT,
    );
    // 7 × $285 = $1995; + $150 cleaning = $2145 taxable; 7% = $150.15.
    expect(quote.nights).toBe(7);
    expect(quote.accommodationCents).toBe(199_500);
    expect(quote.cleaningFeeCents).toBe(15_000);
    expect(quote.taxCents).toBe(15_015);
    expect(quote.totalCents).toBe(229_515);
    expect(quote.lines).toHaveLength(1);
    expect(quote.lines[0]).toMatchObject({ nights: 7, nightlyPriceCents: 28_500 });
  });

  it("prices a stay straddling high → shoulder at two rates", () => {
    // 13–20 Apr 2027: nights 13,14,15 high ($285), 16,17,18,19 shoulder ($225).
    const quote = computeQuote(
      POLICY,
      SEASONS,
      { arrivalDate: "2027-04-13", departureDate: "2027-04-20" },
      FAR_OUT,
    );
    expect(quote.lines).toEqual([
      expect.objectContaining({ nights: 3, nightlyPriceCents: 28_500, subtotalCents: 85_500 }),
      expect.objectContaining({ nights: 4, nightlyPriceCents: 22_500, subtotalCents: 90_000 }),
    ]);
    expect(quote.accommodationCents).toBe(175_500);
    // (175500 + 15000) * 7% = 13335
    expect(quote.taxCents).toBe(13_335);
    expect(quote.totalCents).toBe(203_835);
  });

  it("prices New Year's week across the year boundary as one high-season line", () => {
    const quote = computeQuote(
      POLICY,
      SEASONS,
      { arrivalDate: "2026-12-28", departureDate: "2027-01-04" },
      { today: "2026-06-01" },
    );
    // Two season rows (Dec band, Jan band), same price -> still folded per row.
    expect(quote.nights).toBe(7);
    expect(quote.accommodationCents).toBe(7 * 28_500);
    expect(quote.perNight.map((n) => n.date)).toContain("2027-01-01");
  });

  it("excludes the departure night: back-to-back weeks never double-charge", () => {
    const weekOne = computeQuote(
      POLICY, SEASONS,
      { arrivalDate: "2027-07-03", departureDate: "2027-07-10" },
      FAR_OUT,
    );
    const weekTwo = computeQuote(
      POLICY, SEASONS,
      { arrivalDate: "2027-07-10", departureDate: "2027-07-17" },
      FAR_OUT,
    );
    const bothWeeks = computeQuote(
      POLICY, SEASONS,
      { arrivalDate: "2027-07-03", departureDate: "2027-07-17" },
      FAR_OUT,
    );
    expect(weekOne.accommodationCents + weekTwo.accommodationCents).toBe(
      bothWeeks.accommodationCents,
    );
  });

  it("can exclude the cleaning fee from tax when configured", () => {
    const quote = computeQuote(
      { ...POLICY, taxOnCleaningFee: false },
      SEASONS,
      { arrivalDate: "2027-01-10", departureDate: "2027-01-17" },
      FAR_OUT,
    );
    expect(quote.taxCents).toBe(13_965); // 7% of 199500 only
    expect(quote.totalCents).toBe(199_500 + 15_000 + 13_965);
  });

  it("fails loudly when a night has no configured rate", () => {
    const gappy = curacaoSeasonsWithIds(2026, 2026); // nothing for 2027
    expect(() =>
      computeQuote(
        POLICY, gappy,
        { arrivalDate: "2026-12-28", departureDate: "2027-01-04" },
        { today: "2026-06-01" },
      ),
    ).toThrowError(
      expect.objectContaining({ code: "NO_RATE_FOR_NIGHT", dates: eachNight("2027-01-01", "2027-01-04") }),
    );
  });

  it("rejects inverted and zero-night ranges", () => {
    for (const stay of [
      { arrivalDate: "2027-01-17", departureDate: "2027-01-10" },
      { arrivalDate: "2027-01-10", departureDate: "2027-01-10" },
    ]) {
      expect(() => computeQuote(POLICY, SEASONS, stay, FAR_OUT)).toThrowError(
        expect.objectContaining({ code: "INVALID_RANGE" }),
      );
    }
  });

  it("rejects a stay beyond the maximum", () => {
    expect(() =>
      computeQuote(
        { ...POLICY, maxNights: 10 },
        SEASONS,
        { arrivalDate: "2027-05-01", departureDate: "2027-05-31" },
        FAR_OUT,
      ),
    ).toThrowError(expect.objectContaining({ code: "MAX_NIGHTS_EXCEEDED" }));
  });

  it("rejects malformed dates before touching arithmetic", () => {
    expect(() =>
      computeQuote(POLICY, SEASONS, { arrivalDate: "2027-02-30", departureDate: "2027-03-05" }, FAR_OUT),
    ).toThrow(TypeError);
  });
});

describe("deposit and balance", () => {
  it("offers 30% up front with the balance due 35 days before arrival", () => {
    const quote = computeQuote(
      POLICY, SEASONS,
      { arrivalDate: "2027-01-10", departureDate: "2027-01-17" },
      FAR_OUT,
    );
    expect(quote.depositAllowed).toBe(true);
    expect(quote.depositCents).toBe(68_855); // round(229515 * 0.30) half up
    expect(quote.balanceCents).toBe(160_660);
    expect(quote.depositCents + quote.balanceCents).toBe(quote.totalCents);
    expect(quote.balanceDueDate).toBe("2026-12-06"); // 10 Jan minus 35 days
  });

  it("forces pay-in-full inside the 35-day window", () => {
    const quote = computeQuote(
      POLICY, SEASONS,
      { arrivalDate: "2027-01-10", departureDate: "2027-01-17" },
      { today: "2026-12-20" }, // 21 days out
    );
    expect(quote.depositAllowed).toBe(false);
    expect(quote.depositCents).toBe(quote.totalCents);
    expect(quote.balanceCents).toBe(0);
    expect(quote.balanceDueDate).toBeNull();
    expect(() => paymentAmountFor(quote, "deposit")).toThrow(PricingError);
    expect(paymentAmountFor(quote, "full")).toBe(quote.totalCents);
  });

  it("treats exactly-35-days-out as inside the window (boundary)", () => {
    const arrivalDate = "2027-01-10";
    const onTheLine = computeQuote(
      POLICY, SEASONS,
      { arrivalDate, departureDate: "2027-01-17" },
      { today: addDays(arrivalDate, -35) },
    );
    const oneDayEarlier = computeQuote(
      POLICY, SEASONS,
      { arrivalDate, departureDate: "2027-01-17" },
      { today: addDays(arrivalDate, -36) },
    );
    expect(onTheLine.depositAllowed).toBe(false);
    expect(oneDayEarlier.depositAllowed).toBe(true);
  });

  it("reunites deposit and balance to the total for every plausible total", () => {
    // The deposit rounds; the balance must absorb the rounding, always.
    for (let total = 1; total <= 5_000; total++) {
      const deposit =
        Math.trunc((total * 3_000) / 10_000) +
        (((total * 3_000) % 10_000) * 2 >= 10_000 ? 1 : 0);
      expect(deposit + (total - deposit)).toBe(total);
    }
  });
});

describe("server-side authority invariants", () => {
  it("recomputing a quote from the same inputs is byte-identical", () => {
    const stay = { arrivalDate: "2027-04-13", departureDate: "2027-04-20" };
    const first = computeQuote(POLICY, SEASONS, stay, FAR_OUT);
    const second = computeQuote(POLICY, SEASONS, stay, FAR_OUT);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it("a season order shuffle does not change the quote", () => {
    const stay = { arrivalDate: "2027-04-13", departureDate: "2027-04-20" };
    const reversed = [...SEASONS].reverse();
    expect(computeQuote(POLICY, reversed, stay, FAR_OUT).totalCents).toBe(
      computeQuote(POLICY, SEASONS, stay, FAR_OUT).totalCents,
    );
  });

  it("every quoted amount is an integer, for every stay length in a season sweep", () => {
    for (let nights = 5; nights <= 30; nights += 5) {
      const quote = computeQuote(
        POLICY, SEASONS,
        { arrivalDate: "2027-01-10", departureDate: addDays("2027-01-10", nights) },
        FAR_OUT,
      );
      for (const amount of [
        quote.accommodationCents, quote.cleaningFeeCents, quote.taxCents,
        quote.totalCents, quote.depositCents, quote.balanceCents,
      ]) {
        expect(Number.isSafeInteger(amount)).toBe(true);
      }
      expect(quote.totalCents).toBe(
        quote.accommodationCents + quote.cleaningFeeCents + quote.taxCents,
      );
      expect(quote.perNight).toHaveLength(nightsBetween(quote.arrivalDate, quote.departureDate));
    }
  });

  it("folded lines always sum to the accommodation total", () => {
    const quote = computeQuote(
      POLICY, SEASONS,
      { arrivalDate: "2027-04-10", departureDate: "2027-04-24" },
      FAR_OUT,
    );
    const lineSum = quote.lines.reduce((s, l) => s + l.subtotalCents, 0);
    expect(lineSum).toBe(quote.accommodationCents);
    expect(foldQuoteLines(quote.perNight)).toEqual(quote.lines);
  });

  it("priceNights output matches eachNight one-to-one", () => {
    const priced = priceNights(SEASONS, "2027-06-28", "2027-07-03");
    expect(priced.map((p) => p.date)).toEqual(eachNight("2027-06-28", "2027-07-03"));
    // Straddles shoulder ($225) into low ($189).
    expect(priced.map((p) => p.priceCents)).toEqual([
      22_500, 22_500, 22_500, 18_900, 18_900,
    ]);
  });
});
