"use client";

/**
 * The date-range picker: two-month calendar as a WAI-ARIA grid.
 *
 * Keyboard model (per the APG date-grid pattern): arrows move a day or a
 * week, PageUp/PageDown a month, Home/End to the start/end of the week,
 * Enter or Space picks — first the arrival, then the departure. A roving
 * tabindex keeps exactly one cell tabbable, and selection state is announced
 * through aria-selected plus a polite live region.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  addDays,
  eachNight,
  isBefore,
  nightsBetween,
  type CalendarDate,
} from "@/lib/domain/dates";

export interface UnavailableRange {
  startDate: CalendarDate;
  endDate: CalendarDate;
}

interface Props {
  today: CalendarDate;
  bookableUntil: CalendarDate;
  unavailable: UnavailableRange[];
  arrival: CalendarDate | null;
  departure: CalendarDate | null;
  onSelect: (arrival: CalendarDate | null, departure: CalendarDate | null) => void;
}

function monthStart(date: CalendarDate): CalendarDate {
  return `${date.slice(0, 7)}-01`;
}

function addMonths(date: CalendarDate, months: number): CalendarDate {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7)) - 1 + months;
  const y = year + Math.floor(month / 12);
  const m = ((month % 12) + 12) % 12;
  return `${String(y).padStart(4, "0")}-${String(m + 1).padStart(2, "0")}-01`;
}

/** Monday-first weekday index of a calendar date. */
function weekdayIndex(date: CalendarDate): number {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay();
  return (day + 6) % 7;
}

export function AvailabilityCalendar({
  today,
  bookableUntil,
  unavailable,
  arrival,
  departure,
  onSelect,
}: Props) {
  const t = useTranslations("book.calendar");
  const locale = useLocale();
  const [viewMonth, setViewMonth] = useState<CalendarDate>(monthStart(arrival ?? today));
  const [focusDate, setFocusDate] = useState<CalendarDate>(arrival ?? today);
  const [announcement, setAnnouncement] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(false);

  const isNightTaken = useCallback(
    (date: CalendarDate) =>
      unavailable.some((r) => date >= r.startDate && date < r.endDate),
    [unavailable],
  );

  /** A date can be an arrival when it is in the window and its night is free. */
  const isSelectable = useCallback(
    (date: CalendarDate) => date >= today && date <= bookableUntil,
    [today, bookableUntil],
  );

  const rangeIsFree = useCallback(
    (from: CalendarDate, to: CalendarDate) =>
      eachNight(from, to).every((night) => !isNightTaken(night)),
    [isNightTaken],
  );

  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", { month: "long", timeZone: "UTC" }),
    [locale],
  );
  const dayLabelFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );

  const pick = useCallback(
    (date: CalendarDate) => {
      if (!isSelectable(date)) return;
      if (!arrival || departure || isBefore(date, arrival)) {
        // Start (or restart) the range at this date; needs a free first night.
        if (isNightTaken(date)) return;
        onSelect(date, null);
        setAnnouncement(`${dayLabelFormatter.format(new Date(`${date}T00:00:00Z`))}, ${t("selectedArrival")}`);
        return;
      }
      if (date === arrival) return;
      // Closing the range: every night in between must be free.
      if (!rangeIsFree(arrival, date)) {
        onSelect(date, null);
        setAnnouncement(`${dayLabelFormatter.format(new Date(`${date}T00:00:00Z`))}, ${t("selectedArrival")}`);
        return;
      }
      onSelect(arrival, date);
      setAnnouncement(`${dayLabelFormatter.format(new Date(`${date}T00:00:00Z`))}, ${t("selectedDeparture")}`);
    },
    [arrival, departure, isSelectable, isNightTaken, rangeIsFree, onSelect, dayLabelFormatter, t],
  );

  const moveFocus = useCallback(
    (target: CalendarDate) => {
      const clamped = target < today ? today : target > bookableUntil ? bookableUntil : target;
      setFocusDate(clamped);
      const firstVisible = viewMonth;
      const lastVisible = addDays(addMonths(viewMonth, 2), -1);
      if (clamped < firstVisible || clamped > lastVisible) {
        setViewMonth(monthStart(clamped));
      }
      pendingFocus.current = true;
    },
    [today, bookableUntil, viewMonth],
  );

  // After a re-render moved the roving tabindex, restore DOM focus.
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>(`[data-date="${focusDate}"]`)
      ?.focus();
  });

  function onKeyDown(event: React.KeyboardEvent) {
    const handlers: Record<string, () => void> = {
      ArrowLeft: () => moveFocus(addDays(focusDate, -1)),
      ArrowRight: () => moveFocus(addDays(focusDate, 1)),
      ArrowUp: () => moveFocus(addDays(focusDate, -7)),
      ArrowDown: () => moveFocus(addDays(focusDate, 7)),
      Home: () => moveFocus(addDays(focusDate, -weekdayIndex(focusDate))),
      End: () => moveFocus(addDays(focusDate, 6 - weekdayIndex(focusDate))),
      PageUp: () => moveFocus(addMonths(monthStart(focusDate), -1)),
      PageDown: () => moveFocus(addMonths(monthStart(focusDate), 1)),
      Enter: () => pick(focusDate),
      " ": () => pick(focusDate),
    };
    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  }

  const weekdays = t.raw("weekdays") as string[];

  function renderMonth(start: CalendarDate) {
    const year = start.slice(0, 4);
    const monthName = monthFormatter.format(new Date(`${start}T00:00:00Z`));
    const firstWeekday = weekdayIndex(start);
    const nextMonth = addMonths(start, 1);
    const daysInMonth = nightsBetween(start, nextMonth);

    const cells: (CalendarDate | null)[] = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => addDays(start, i)),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (CalendarDate | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
      <table role="grid" aria-label={t("label", { month: monthName, year })} className="w-full border-collapse">
        <caption className="pb-2 text-left font-[family-name:var(--font-display)] text-lg text-navy">
          {monthName} {year}
        </caption>
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day} scope="col" className="pb-1 text-center text-xs font-semibold uppercase text-ink/50">
                <span aria-hidden="true">{day}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((date, di) => {
                if (!date) return <td key={di} className="p-0.5" />;
                const taken = isNightTaken(date);
                const outOfWindow = !isSelectable(date);
                const isArrival = date === arrival;
                const isDeparture = date === departure;
                const inRange =
                  arrival && departure && date > arrival && date < departure;
                const disabled = outOfWindow || (taken && !isDeparture);
                return (
                  <td key={di} role="gridcell" className="p-0.5 text-center"
                    aria-selected={isArrival || isDeparture || Boolean(inRange)}
                  >
                    <button
                      type="button"
                      data-date={date}
                      tabIndex={date === focusDate ? 0 : -1}
                      disabled={outOfWindow}
                      aria-disabled={disabled || undefined}
                      aria-label={`${dayLabelFormatter.format(new Date(`${date}T00:00:00Z`))}${
                        taken ? `, ${t("unavailableDay")}` : ""
                      }${isArrival ? `, ${t("selectedArrival")}` : ""}${
                        isDeparture ? `, ${t("selectedDeparture")}` : ""
                      }`}
                      onClick={() => {
                        moveFocus(date);
                        pick(date);
                      }}
                      onFocus={() => setFocusDate(date)}
                      className={[
                        "h-10 w-full min-w-10 rounded-md text-sm tabular-nums transition-colors",
                        outOfWindow ? "text-ink/25"
                        : taken ? "text-ink/35 line-through"
                        : "text-ink hover:bg-turquoise/15",
                        isArrival || isDeparture ? "bg-navy font-semibold text-sand hover:bg-navy" : "",
                        inRange ? "bg-turquoise/20" : "",
                        date === today ? "ring-1 ring-inset ring-terracotta/60" : "",
                      ].join(" ")}
                    >
                      {Number(date.slice(8, 10))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, -1))}
          disabled={viewMonth <= monthStart(today)}
          aria-label={t("prevMonth")}
          className="rounded-md border border-navy/20 px-3 py-1.5 text-navy disabled:opacity-30"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          disabled={addMonths(viewMonth, 2) > bookableUntil}
          aria-label={t("nextMonth")}
          className="rounded-md border border-navy/20 px-3 py-1.5 text-navy disabled:opacity-30"
        >
          →
        </button>
      </div>
      <div
        ref={gridRef}
        onKeyDown={onKeyDown}
        className="grid gap-8 md:grid-cols-2"
      >
        {renderMonth(viewMonth)}
        <div className="hidden md:block">{renderMonth(addMonths(viewMonth, 1))}</div>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
