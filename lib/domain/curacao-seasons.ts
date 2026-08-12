/**
 * The real Curaçao season calendar, as pure data. Used by the seed script and
 * by the pricing tests, so the tests exercise the exact bands production runs.
 *
 * Per calendar year:
 *   high      15 Dec – 15 Apr (wraps the year boundary), 5-night minimum
 *   shoulder  16 Apr – 30 Jun and 1 Sep – 14 Dec, 3-night minimum
 *   low        1 Jul – 31 Aug, 3-night minimum
 */

import { calendarDate } from "./dates";
import type { SeasonRate } from "./pricing";
import type { Cents } from "./money";

export interface CuracaoSeasonPrices {
  highCents: Cents;
  shoulderCents: Cents;
  lowCents: Cents;
}

/** Sensible 2026 launch prices; the admin edits these later, per row. */
export const DEFAULT_PRICES: CuracaoSeasonPrices = {
  highCents: 285_00,
  shoulderCents: 225_00,
  lowCents: 189_00,
};

/**
 * Bands for every season whose nights touch [fromYear, toYear]. The
 * year-wrapping high season is emitted as two rows (15 Dec–31 Dec and
 * 1 Jan–15 Apr) because a season row is a plain date range; the pricing
 * engine treats adjacent same-price rows as one stretch anyway.
 */
export function curacaoSeasons(
  fromYear: number,
  toYear: number,
  prices: CuracaoSeasonPrices = DEFAULT_PRICES,
): Omit<SeasonRate, "id">[] {
  const bands: Omit<SeasonRate, "id">[] = [];
  for (let year = fromYear; year <= toYear; year++) {
    bands.push(
      {
        label: `Hoogseizoen ${year - 1}/${year}`,
        startDate: calendarDate(year, 1, 1),
        endDate: calendarDate(year, 4, 15),
        nightlyPriceCents: prices.highCents,
        minNights: 5,
        priority: 10,
      },
      {
        label: `Tussenseizoen voorjaar ${year}`,
        startDate: calendarDate(year, 4, 16),
        endDate: calendarDate(year, 6, 30),
        nightlyPriceCents: prices.shoulderCents,
        minNights: 3,
        priority: 10,
      },
      {
        label: `Laagseizoen ${year}`,
        startDate: calendarDate(year, 7, 1),
        endDate: calendarDate(year, 8, 31),
        nightlyPriceCents: prices.lowCents,
        minNights: 3,
        priority: 10,
      },
      {
        label: `Tussenseizoen najaar ${year}`,
        startDate: calendarDate(year, 9, 1),
        endDate: calendarDate(year, 12, 14),
        nightlyPriceCents: prices.shoulderCents,
        minNights: 3,
        priority: 10,
      },
      {
        label: `Hoogseizoen ${year}/${year + 1}`,
        startDate: calendarDate(year, 12, 15),
        endDate: calendarDate(year, 12, 31),
        nightlyPriceCents: prices.highCents,
        minNights: 5,
        priority: 10,
      },
    );
  }
  return bands;
}

/** Test/seed helper: same bands with deterministic ids. */
export function curacaoSeasonsWithIds(
  fromYear: number,
  toYear: number,
  prices?: CuracaoSeasonPrices,
): SeasonRate[] {
  return curacaoSeasons(fromYear, toYear, prices).map((band, i) => ({
    ...band,
    id: `season-${band.startDate}-${i}`,
  }));
}
