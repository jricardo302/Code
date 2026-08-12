/**
 * Minimal iCalendar builder — RFC 5545 all-day events, which is all a stay
 * needs. Hand-rolled because the format is tiny and a dependency would be
 * larger than this file.
 */

import { addDays, toIcalDate, type CalendarDate } from "../domain/dates";

export interface IcsEvent {
  uid: string;
  /** First night. */
  start: CalendarDate;
  /** Exclusive end — the departure date, matching DTEND semantics exactly. */
  end: CalendarDate;
  summary: string;
  description?: string;
  location?: string;
  url?: string;
}

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold lines at 75 octets per RFC 5545 §3.1. */
function fold(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let start = 0;
  while (start < bytes.length) {
    // Take up to 74 bytes but never split a UTF-8 sequence.
    let end = Math.min(start + 74, bytes.length);
    while (end > start && end < bytes.length && (bytes[end]! & 0xc0) === 0x80) end--;
    parts.push(bytes.subarray(start, end).toString("utf8"));
    start = end;
  }
  return parts.join("\r\n ");
}

export function buildIcs(
  events: IcsEvent[],
  {
    calendarName,
    now = new Date(),
  }: { calendarName: string; now?: Date },
): string {
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Lighthouse Curacao//Booking//NL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
  ];
  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${escapeText(event.uid)}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${toIcalDate(event.start)}`,
      `DTEND;VALUE=DATE:${toIcalDate(event.end)}`,
      `SUMMARY:${escapeText(event.summary)}`,
    );
    if (event.description) lines.push(`DESCRIPTION:${escapeText(event.description)}`);
    if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
    if (event.url) lines.push(`URL:${escapeText(event.url)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** The guest-facing attachment for one booking. */
export function bookingIcs(booking: {
  reference: string;
  arrivalDate: CalendarDate;
  departureDate: CalendarDate;
  propertyName: string;
  address: string;
  url?: string;
}): string {
  return buildIcs(
    [
      {
        uid: `${booking.reference}@lighthouse-curacao`,
        start: booking.arrivalDate,
        end: booking.departureDate,
        summary: `${booking.propertyName} — ${booking.reference}`,
        description: `Verblijf ${booking.arrivalDate} t/m ${addDays(booking.departureDate, -1)}`,
        location: booking.address,
        url: booking.url,
      },
    ],
    { calendarName: booking.propertyName },
  );
}
