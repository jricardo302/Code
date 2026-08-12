import { describe, expect, it } from "vitest";
import { buildIcs } from "../email/ics";
import { parseIcalEvents } from "./import";

const AIRBNB_STYLE = [
  "BEGIN:VCALENDAR",
  "PRODID:-//Airbnb Inc//Hosting Calendar 1.0//EN",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "DTSTAMP:20260810T120000Z",
  "DTSTART;VALUE=DATE:20261220",
  "DTEND;VALUE=DATE:20261227",
  "UID:airbnb-1234abcd@airbnb.com",
  "SUMMARY:Reserved",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "DTSTAMP:20260810T120000Z",
  "DTSTART;VALUE=DATE:20270110",
  "DTEND;VALUE=DATE:20270115",
  "UID:airbnb-notavail@airbnb.com",
  "SUMMARY:Airbnb (Not available)",
  "END:VEVENT",
  "END:VCALENDAR",
].join("\r\n");

describe("parseIcalEvents", () => {
  it("parses an Airbnb-style busy feed", () => {
    const events = parseIcalEvents(AIRBNB_STYLE);
    expect(events).toEqual([
      {
        uid: "airbnb-1234abcd@airbnb.com",
        start: "2026-12-20",
        end: "2026-12-27",
        summary: "Reserved",
      },
      {
        uid: "airbnb-notavail@airbnb.com",
        start: "2027-01-10",
        end: "2027-01-15",
        summary: "Airbnb (Not available)",
      },
    ]);
  });

  it("handles datetime DTSTART values by truncating to the date", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "UID:x@booking.com",
      "DTSTART:20270301T140000Z",
      "DTEND:20270305T100000Z",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    expect(parseIcalEvents(ics)).toEqual([
      { uid: "x@booking.com", start: "2027-03-01", end: "2027-03-05", summary: "" },
    ]);
  });

  it("unfolds folded lines before parsing", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "UID:folded-uid-that-is-quite-long-and-",
      " continues-on-the-next-line@example.com",
      "DTSTART;VALUE=DATE:20270401",
      "DTEND;VALUE=DATE:20270403",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    expect(parseIcalEvents(ics)[0]?.uid).toBe(
      "folded-uid-that-is-quite-long-and-continues-on-the-next-line@example.com",
    );
  });

  it("skips events that are malformed rather than failing the sync", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "BEGIN:VEVENT",
      "UID:no-dates@example.com",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:inverted@example.com",
      "DTSTART;VALUE=DATE:20270405",
      "DTEND;VALUE=DATE:20270401",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:good@example.com",
      "DTSTART;VALUE=DATE:20270501",
      "DTEND;VALUE=DATE:20270503",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const events = parseIcalEvents(ics);
    expect(events).toHaveLength(1);
    expect(events[0]?.uid).toBe("good@example.com");
  });

  it("round-trips our own outgoing feed", () => {
    const ics = buildIcs(
      [
        {
          uid: "booking-1@lighthouse-curacao",
          start: "2027-02-01",
          end: "2027-02-08",
          summary: "Booked",
        },
      ],
      { calendarName: "Lighthouse Curaçao", now: new Date("2026-08-12T12:00:00Z") },
    );
    expect(ics).toContain("DTSTART;VALUE=DATE:20270201");
    expect(ics.endsWith("\r\n")).toBe(true);
    expect(parseIcalEvents(ics)).toEqual([
      { uid: "booking-1@lighthouse-curacao", start: "2027-02-01", end: "2027-02-08", summary: "Booked" },
    ]);
  });
});
