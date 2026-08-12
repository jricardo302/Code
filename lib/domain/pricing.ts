/**
 * The pricing engine.
 *
 * Pure functions over plain data: no database, no clock, no I/O. The server
 * loads property + seasons, calls `computeQuote`, and gets back the one
 * authoritative number. The client may render a quote for display, but before
 * a payment is created the server recomputes the quote from its own data and
 * compares — see the invariant tests in pricing.test.ts.
 *
 * Every amount is integer cents (lib/domain/money.ts) and every date is a
 * plain calendar date (lib/domain/dates.ts).
 */

import {
  addDays,
  assertCalendarDate,
  eachNight,
  isWithin,
  nightsBetween,
  type CalendarDate,
} from "./dates";
import {
  applyBasisPoints,
  assertNonNegativeCents,
  sumCents,
  type BasisPoints,
  type Cents,
} from "./money";

// ---------------------------------------------------------------------------
// Inputs — deliberately narrower than the DB rows, so the engine can be fed
// from Drizzle results, seed data, or a test literal alike.
// ---------------------------------------------------------------------------

export interface SeasonRate {
  id: string;
  label: string;
  /** Inclusive. */
  startDate: CalendarDate;
  /** Inclusive. */
  endDate: CalendarDate;
  nightlyPriceCents: Cents;
  minNights: number;
  /** Higher wins where bands overlap; ties broken by later startDate, then id. */
  priority: number;
}

export interface PricingPolicy {
  currency: string;
  cleaningFeeCents: Cents;
  /** Turnover tax, e.g. 700 for Curaçao's 7% OB. */
  taxRateBps: BasisPoints;
  taxOnCleaningFee: boolean;
  /** Deposit share of the total, e.g. 3000 for 30%. */
  depositBps: BasisPoints;
  /** Balance falls due this many days before arrival. */
  balanceDueDays: number;
  /** Closer to arrival than this, the deposit option disappears. */
  payInFullWithinDays: number;
  minNightsFloor: number;
  maxNights: number;
}

export interface StayRequest {
  arrivalDate: CalendarDate;
  departureDate: CalendarDate;
}

// ---------------------------------------------------------------------------
// Outputs
// ---------------------------------------------------------------------------

export interface NightPrice {
  date: CalendarDate;
  seasonId: string;
  seasonLabel: string;
  priceCents: Cents;
}

/** Consecutive nights at one rate, folded for display: "7 × $250". */
export interface QuoteLine {
  seasonId: string;
  seasonLabel: string;
  nights: number;
  nightlyPriceCents: Cents;
  subtotalCents: Cents;
}

export interface Quote {
  currency: string;
  arrivalDate: CalendarDate;
  departureDate: CalendarDate;
  nights: number;
  perNight: NightPrice[];
  lines: QuoteLine[];
  accommodationCents: Cents;
  cleaningFeeCents: Cents;
  taxRateBps: BasisPoints;
  taxCents: Cents;
  totalCents: Cents;
  /** The strictest minimum across the nights of the stay. */
  minNights: number;
  depositCents: Cents;
  balanceCents: Cents;
  /** Null when the stay is inside the pay-in-full window. */
  balanceDueDate: CalendarDate | null;
  /** Whether the 30% option may be offered at all for this stay. */
  depositAllowed: boolean;
}

// ---------------------------------------------------------------------------
// Errors — one class per reason the UI must distinguish.
// ---------------------------------------------------------------------------

export type PricingErrorCode =
  | "INVALID_RANGE"
  | "NO_RATE_FOR_NIGHT"
  | "MIN_NIGHTS_NOT_MET"
  | "MAX_NIGHTS_EXCEEDED";

export class PricingError extends Error {
  readonly code: PricingErrorCode;
  /** The night(s) the message is about, when that helps the guest. */
  readonly dates: CalendarDate[];

  constructor(code: PricingErrorCode, message: string, dates: CalendarDate[] = []) {
    super(message);
    this.name = "PricingError";
    this.code = code;
    this.dates = dates;
  }
}

// ---------------------------------------------------------------------------
// Season resolution
// ---------------------------------------------------------------------------

/**
 * The season that prices a given night, or null when none covers it.
 *
 * Overlaps resolve by priority; a tie resolves to the band that starts later
 * (the more specific one), and finally by id so the outcome is deterministic
 * even for pathological data.
 */
export function resolveSeasonForNight(
  seasons: readonly SeasonRate[],
  night: CalendarDate,
): SeasonRate | null {
  let winner: SeasonRate | null = null;
  for (const season of seasons) {
    if (!isWithin(night, season.startDate, season.endDate)) continue;
    if (
      winner === null ||
      season.priority > winner.priority ||
      (season.priority === winner.priority &&
        (season.startDate > winner.startDate ||
          (season.startDate === winner.startDate && season.id < winner.id)))
    ) {
      winner = season;
    }
  }
  return winner;
}

/** Price every night of the stay, failing loudly on the first uncovered night. */
export function priceNights(
  seasons: readonly SeasonRate[],
  arrivalDate: CalendarDate,
  departureDate: CalendarDate,
): NightPrice[] {
  const uncovered: CalendarDate[] = [];
  const priced: NightPrice[] = [];
  for (const night of eachNight(arrivalDate, departureDate)) {
    const season = resolveSeasonForNight(seasons, night);
    if (!season) {
      uncovered.push(night);
      continue;
    }
    priced.push({
      date: night,
      seasonId: season.id,
      seasonLabel: season.label,
      priceCents: assertNonNegativeCents(season.nightlyPriceCents, "nightly price"),
    });
  }
  if (uncovered.length > 0) {
    throw new PricingError(
      "NO_RATE_FOR_NIGHT",
      `No rate configured for ${uncovered.length} night(s) starting ${uncovered[0]}`,
      uncovered,
    );
  }
  return priced;
}

/** Fold consecutive same-season nights into display lines. */
export function foldQuoteLines(perNight: readonly NightPrice[]): QuoteLine[] {
  const lines: QuoteLine[] = [];
  for (const night of perNight) {
    const last = lines[lines.length - 1];
    if (
      last &&
      last.seasonId === night.seasonId &&
      last.nightlyPriceCents === night.priceCents
    ) {
      last.nights += 1;
      last.subtotalCents += night.priceCents;
    } else {
      lines.push({
        seasonId: night.seasonId,
        seasonLabel: night.seasonLabel,
        nights: 1,
        nightlyPriceCents: night.priceCents,
        subtotalCents: night.priceCents,
      });
    }
  }
  return lines;
}

/**
 * The minimum-stay rule for a stay is the strictest minimum among its nights,
 * never below the property floor. One high-season night inside an otherwise
 * shoulder stay is enough to demand the high-season minimum: the rule protects
 * the scarce nights, not the cheap ones.
 */
export function requiredMinNights(
  seasons: readonly SeasonRate[],
  arrivalDate: CalendarDate,
  departureDate: CalendarDate,
  floor: number,
): number {
  let required = floor;
  for (const night of eachNight(arrivalDate, departureDate)) {
    const season = resolveSeasonForNight(seasons, night);
    if (season && season.minNights > required) required = season.minNights;
  }
  return required;
}

// ---------------------------------------------------------------------------
// The quote
// ---------------------------------------------------------------------------

export interface QuoteOptions {
  /**
   * "Today" at the property, used only to decide whether the deposit option
   * is still on the table. Injected so tests and the server both control it.
   */
  today: CalendarDate;
}

export function computeQuote(
  policy: PricingPolicy,
  seasons: readonly SeasonRate[],
  stay: StayRequest,
  { today }: QuoteOptions,
): Quote {
  const arrivalDate = assertCalendarDate(stay.arrivalDate, "arrival");
  const departureDate = assertCalendarDate(stay.departureDate, "departure");
  assertCalendarDate(today, "today");

  const nights = nightsBetween(arrivalDate, departureDate);
  if (nights <= 0) {
    throw new PricingError(
      "INVALID_RANGE",
      "Departure must be after arrival",
      [arrivalDate, departureDate],
    );
  }
  if (nights > policy.maxNights) {
    throw new PricingError(
      "MAX_NIGHTS_EXCEEDED",
      `Stays are limited to ${policy.maxNights} nights`,
    );
  }

  const minNights = requiredMinNights(
    seasons,
    arrivalDate,
    departureDate,
    policy.minNightsFloor,
  );
  if (nights < minNights) {
    throw new PricingError(
      "MIN_NIGHTS_NOT_MET",
      `This stay requires a minimum of ${minNights} nights`,
    );
  }

  const perNight = priceNights(seasons, arrivalDate, departureDate);
  const lines = foldQuoteLines(perNight);
  const accommodationCents = sumCents(perNight.map((n) => n.priceCents));
  const cleaningFeeCents = assertNonNegativeCents(
    policy.cleaningFeeCents,
    "cleaning fee",
  );

  // Tax on the accommodation, and on the cleaning fee when configured.
  // One rounding at the end of the taxable base — not per night — so the
  // total the guest sees equals base + fee + tax to the cent.
  const taxableCents = policy.taxOnCleaningFee
    ? accommodationCents + cleaningFeeCents
    : accommodationCents;
  const taxCents = applyBasisPoints(taxableCents, policy.taxRateBps);
  const totalCents = accommodationCents + cleaningFeeCents + taxCents;

  // Deposit rounds half up; the balance is the exact remainder, so the two
  // always reunite to the total. Never compute both sides independently.
  const daysUntilArrival = nightsBetween(today, arrivalDate);
  const depositAllowed =
    policy.depositBps > 0 &&
    policy.depositBps < 10_000 &&
    daysUntilArrival > policy.payInFullWithinDays;
  const depositCents = depositAllowed
    ? applyBasisPoints(totalCents, policy.depositBps)
    : totalCents;
  const balanceCents = totalCents - depositCents;
  const balanceDueDate =
    balanceCents > 0 ? addDays(arrivalDate, -policy.balanceDueDays) : null;

  return {
    currency: policy.currency,
    arrivalDate,
    departureDate,
    nights,
    perNight,
    lines,
    accommodationCents,
    cleaningFeeCents,
    taxRateBps: policy.taxRateBps,
    taxCents,
    totalCents,
    minNights,
    depositCents,
    balanceCents,
    balanceDueDate,
    depositAllowed,
  };
}

/**
 * The comparison the payment route runs before creating a provider payment:
 * the client's displayed total must equal the server's recomputed total, and
 * the amount actually charged must be exactly the deposit or the full total.
 * Anything else is stale data or tampering; either way the answer is no.
 */
export function paymentAmountFor(
  quote: Quote,
  plan: "deposit" | "full",
): Cents {
  if (plan === "deposit") {
    if (!quote.depositAllowed) {
      throw new PricingError(
        "INVALID_RANGE",
        "Deposit payment is no longer available for this arrival date",
      );
    }
    return quote.depositCents;
  }
  return quote.totalCents;
}
