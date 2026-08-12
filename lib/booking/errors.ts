/**
 * Booking failures the UI must tell apart. Every code maps to a translated
 * message on the client; the HTTP layer maps them to status codes.
 */

export type BookingErrorCode =
  | "DATES_UNAVAILABLE"
  | "PROPERTY_NOT_FOUND"
  | "BOOKING_NOT_FOUND"
  | "TOO_MANY_GUESTS"
  | "ARRIVAL_IN_PAST"
  | "TOO_FAR_AHEAD"
  | "QUOTE_MISMATCH"
  | "INVALID_STATE";

export class BookingError extends Error {
  readonly code: BookingErrorCode;

  constructor(code: BookingErrorCode, message: string) {
    super(message);
    this.name = "BookingError";
    this.code = code;
  }
}

/** Postgres error code for an EXCLUDE constraint violation. */
export const EXCLUSION_VIOLATION = "23P01";

/**
 * True when an unknown throw is the database refusing an overlapping stay —
 * the loud failure the race between two guests is designed to produce.
 * Drizzle wraps the Postgres error (which carries `code`) in a
 * DrizzleQueryError, so the cause chain is walked, not just the top error.
 */
export function isOverlapViolation(error: unknown): boolean {
  for (
    let e = error;
    typeof e === "object" && e !== null;
    e = (e as { cause?: unknown }).cause
  ) {
    if ((e as { code?: string }).code === EXCLUSION_VIOLATION) return true;
  }
  return false;
}
