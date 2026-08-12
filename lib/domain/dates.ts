/**
 * Calendar dates for a holiday let.
 *
 * A night is a calendar day in the property's own timezone. It is never a
 * point in time. If we stored arrival as a UTC timestamp, a guest booking from
 * Amsterdam at 00:30 CET would arrive "the day before" in Curaçao, and the
 * night count would silently shift. So every date in the booking domain is a
 * plain `YYYY-MM-DD` string, and the only place the timezone appears is
 * `todayInTimezone`, where we ask "what day is it right now at the house?".
 *
 * All arithmetic below goes through UTC midnight purely as a counter. That is
 * safe because we never convert the result back to a wall-clock time.
 */

/** A plain calendar date, `YYYY-MM-DD`. */
export type CalendarDate = string;

const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const MS_PER_DAY = 86_400_000;

/** The property's timezone. Curaçao has no daylight saving, but never assume. */
export const PROPERTY_TIMEZONE = "America/Curacao";

export function isCalendarDate(value: unknown): value is CalendarDate {
  if (typeof value !== "string") return false;
  const match = CALENDAR_DATE.exec(value);
  if (!match) return false;
  const [, year, month, day] = match;
  const utc = Date.UTC(Number(year), Number(month) - 1, Number(day));
  // Rejects 2026-02-30 and friends: Date.UTC rolls those over to March.
  return toCalendarDate(utc) === value;
}

/** Throws on anything that is not a real calendar date. */
export function assertCalendarDate(
  value: unknown,
  label = "date",
): CalendarDate {
  if (!isCalendarDate(value)) {
    throw new TypeError(`${label} must be a YYYY-MM-DD calendar date`);
  }
  return value;
}

/** Milliseconds at UTC midnight of that calendar day. Internal counter only. */
function toEpochDay(date: CalendarDate): number {
  const match = CALENDAR_DATE.exec(date);
  if (!match) throw new TypeError(`Not a calendar date: ${date}`);
  const [, year, month, day] = match;
  return Date.UTC(Number(year), Number(month) - 1, Number(day));
}

function toCalendarDate(epochMs: number): CalendarDate {
  const d = new Date(epochMs);
  const year = String(d.getUTCFullYear()).padStart(4, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Build a calendar date from its parts. Month is 1-based. */
export function calendarDate(
  year: number,
  month: number,
  day: number,
): CalendarDate {
  return toCalendarDate(Date.UTC(year, month - 1, day));
}

export function addDays(date: CalendarDate, days: number): CalendarDate {
  return toCalendarDate(toEpochDay(date) + days * MS_PER_DAY);
}

/** Negative when `a` is earlier, so it drops straight into `sort()`. */
export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isBefore(a: CalendarDate, b: CalendarDate): boolean {
  return a < b;
}

export function isAfter(a: CalendarDate, b: CalendarDate): boolean {
  return a > b;
}

/** Inclusive on both ends. */
export function isWithin(
  date: CalendarDate,
  start: CalendarDate,
  end: CalendarDate,
): boolean {
  return date >= start && date <= end;
}

export function minDate(a: CalendarDate, b: CalendarDate): CalendarDate {
  return a <= b ? a : b;
}

export function maxDate(a: CalendarDate, b: CalendarDate): CalendarDate {
  return a >= b ? a : b;
}

/**
 * Nights slept between arrival and departure. A stay is a half-open range
 * `[arrival, departure)`: you sleep on the arrival date, you do not sleep on
 * the departure date. Same-day departure is zero nights, not one.
 */
export function nightsBetween(
  arrival: CalendarDate,
  departure: CalendarDate,
): number {
  return Math.round((toEpochDay(departure) - toEpochDay(arrival)) / MS_PER_DAY);
}

/** Every date the guest sleeps at the house: arrival up to, but not including, departure. */
export function eachNight(
  arrival: CalendarDate,
  departure: CalendarDate,
): CalendarDate[] {
  const nights: CalendarDate[] = [];
  for (let d = arrival; d < departure; d = addDays(d, 1)) nights.push(d);
  return nights;
}

/** True when two half-open stays fight over at least one night. */
export function rangesOverlap(
  aStart: CalendarDate,
  aEnd: CalendarDate,
  bStart: CalendarDate,
  bEnd: CalendarDate,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Today, as the house sees it. */
export function todayInTimezone(
  timeZone: string = PROPERTY_TIMEZONE,
  now: Date = new Date(),
): CalendarDate {
  // en-CA formats as YYYY-MM-DD, which is exactly our wire format.
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** `20261215` — the form iCal wants for all-day VEVENT dates. */
export function toIcalDate(date: CalendarDate): string {
  return date.replace(/-/g, "");
}
