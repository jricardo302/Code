import { describe, expect, it } from "vitest";
import {
  addDays,
  calendarDate,
  eachNight,
  isCalendarDate,
  nightsBetween,
  rangesOverlap,
  toIcalDate,
  todayInTimezone,
} from "./dates";

describe("isCalendarDate", () => {
  it("accepts real dates", () => {
    expect(isCalendarDate("2026-12-15")).toBe(true);
    expect(isCalendarDate("2028-02-29")).toBe(true); // leap year
  });

  it("rejects impossible and malformed dates", () => {
    expect(isCalendarDate("2026-02-30")).toBe(false);
    expect(isCalendarDate("2026-13-01")).toBe(false);
    expect(isCalendarDate("2027-02-29")).toBe(false); // not a leap year
    expect(isCalendarDate("2026-1-5")).toBe(false);
    expect(isCalendarDate("15-12-2026")).toBe(false);
    expect(isCalendarDate("2026-12-15T00:00:00Z")).toBe(false);
    expect(isCalendarDate(20261215)).toBe(false);
  });
});

describe("night arithmetic", () => {
  it("counts nights as a half-open range", () => {
    expect(nightsBetween("2026-12-20", "2026-12-27")).toBe(7);
    expect(nightsBetween("2026-12-20", "2026-12-21")).toBe(1);
    expect(nightsBetween("2026-12-20", "2026-12-20")).toBe(0);
  });

  it("crosses month, year, and leap boundaries without drifting", () => {
    expect(nightsBetween("2026-12-28", "2027-01-04")).toBe(7);
    expect(nightsBetween("2028-02-27", "2028-03-02")).toBe(4); // leap February
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
  });

  it("is immune to DST transitions in the runtime's own timezone", () => {
    // The EU spring-forward date. If any arithmetic passed through local
    // time, a Europe/Amsterdam server would lose an hour here and Math.round
    // would be doing load-bearing work.
    expect(nightsBetween("2027-03-27", "2027-03-29")).toBe(2);
    expect(eachNight("2027-03-27", "2027-03-30")).toEqual([
      "2027-03-27",
      "2027-03-28",
      "2027-03-29",
    ]);
  });

  it("lists the nights slept, excluding departure day", () => {
    expect(eachNight("2026-12-30", "2027-01-02")).toEqual([
      "2026-12-30",
      "2026-12-31",
      "2027-01-01",
    ]);
    expect(eachNight("2026-12-30", "2026-12-30")).toEqual([]);
  });
});

describe("rangesOverlap", () => {
  it("treats back-to-back stays as non-overlapping", () => {
    // Guest A departs the morning of the 27th, guest B arrives that afternoon.
    expect(rangesOverlap("2026-12-20", "2026-12-27", "2026-12-27", "2027-01-03")).toBe(false);
  });

  it("detects any shared night", () => {
    expect(rangesOverlap("2026-12-20", "2026-12-27", "2026-12-26", "2026-12-30")).toBe(true);
    expect(rangesOverlap("2026-12-20", "2026-12-27", "2026-12-01", "2026-12-21")).toBe(true);
    expect(rangesOverlap("2026-12-20", "2026-12-27", "2026-12-22", "2026-12-24")).toBe(true);
  });
});

describe("todayInTimezone", () => {
  it("gives the calendar date at the house, not in UTC", () => {
    // 02:30 UTC on 2 Jan is still 22:30 on 1 Jan in Curaçao (UTC-4).
    const lateEvening = new Date("2027-01-02T02:30:00Z");
    expect(todayInTimezone("America/Curacao", lateEvening)).toBe("2027-01-01");
    expect(todayInTimezone("UTC", lateEvening)).toBe("2027-01-02");
  });
});

describe("helpers", () => {
  it("builds and formats", () => {
    expect(calendarDate(2026, 12, 15)).toBe("2026-12-15");
    expect(toIcalDate("2026-12-15")).toBe("20261215");
  });
});
