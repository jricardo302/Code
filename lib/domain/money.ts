/**
 * Money is integer cents. Always.
 *
 * A float total is wrong roughly one booking in a hundred, and the one that is
 * wrong is the one the guest screenshots. Percentages are basis points
 * (1 bp = 0.01%, so 7% = 700 bps) so that rates are integers too, and the
 * arithmetic below never leaves the integer domain: no `*0.07`, no `toFixed`,
 * nothing that can produce 1234.9999999999998.
 */

/** An amount in minor units (cents). Always an integer. */
export type Cents = number;

/** A rate in basis points. 1 bp = 0.01%. 700 = 7%. */
export type BasisPoints = number;

export function assertCents(value: number, label = "amount"): Cents {
  if (!Number.isSafeInteger(value)) {
    throw new TypeError(`${label} must be an integer number of cents`);
  }
  return value;
}

export function assertNonNegativeCents(value: number, label = "amount"): Cents {
  assertCents(value, label);
  if (value < 0) throw new RangeError(`${label} must not be negative`);
  return value;
}

/**
 * `cents * bps / 10000`, rounded half up, without ever touching a float.
 *
 * The remainder comparison is the rounding: doubling it and testing against
 * the divisor is "is the fraction at least a half?" in integer form.
 */
export function applyBasisPoints(cents: Cents, bps: BasisPoints): Cents {
  assertCents(cents, "amount");
  if (!Number.isSafeInteger(bps) || bps < 0) {
    throw new RangeError("rate must be a non-negative whole number of basis points");
  }
  const numerator = cents * bps;
  if (!Number.isSafeInteger(numerator)) {
    throw new RangeError("amount too large to price exactly");
  }
  const whole = Math.trunc(numerator / 10_000);
  const remainder = numerator % 10_000;
  return whole + (remainder * 2 >= 10_000 ? 1 : 0);
}

/** Nightly rate times a night count. Separate function so it reads as intent. */
export function multiplyCents(cents: Cents, factor: number): Cents {
  assertCents(cents, "amount");
  if (!Number.isSafeInteger(factor) || factor < 0) {
    throw new RangeError("factor must be a non-negative whole number");
  }
  return assertCents(cents * factor, "product");
}

export function sumCents(amounts: readonly Cents[]): Cents {
  let total = 0;
  for (const amount of amounts) total += assertCents(amount, "amount");
  return assertCents(total, "total");
}

/** Percentage as a human writes it (7) into basis points (700). */
export function percentToBasisPoints(percent: number): BasisPoints {
  const bps = Math.round(percent * 100);
  if (!Number.isSafeInteger(bps) || bps < 0) {
    throw new RangeError("percentage must be non-negative");
  }
  return bps;
}

export function basisPointsToPercent(bps: BasisPoints): number {
  return bps / 100;
}

/**
 * For display only. The authoritative amount is the integer; this is the
 * string we show next to it.
 */
export function formatCents(
  cents: Cents,
  { locale = "nl-NL", currency = "USD" }: { locale?: string; currency?: string } = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Cents as the decimal string payment providers expect, e.g. `1234` -> `"12.34"`. */
export function toDecimalString(cents: Cents): string {
  assertCents(cents, "amount");
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.trunc(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** The inverse, for reading amounts back off a provider webhook. */
export function fromDecimalString(value: string): Cents {
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(value.trim());
  if (!match) throw new TypeError(`Not a decimal amount: ${value}`);
  const [, sign, whole, fraction = "0"] = match;
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return sign === "-" ? -cents : cents;
}
