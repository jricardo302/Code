"use client";

/**
 * The booking flow, one screen: calendar → live quote → details → payment.
 * The quote shown here is display only; /api/bookings recomputes it and the
 * expectedTotalCents guard makes any drift explicit instead of silent.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { addDays, type CalendarDate } from "@/lib/domain/dates";
import { formatCents } from "@/lib/domain/money";
import type { QuoteLine } from "@/lib/domain/pricing";
import { AvailabilityCalendar, type UnavailableRange } from "./AvailabilityCalendar";

interface AvailabilityData {
  today: CalendarDate;
  bookableUntil: CalendarDate;
  maxGuests: number;
  unavailable: UnavailableRange[];
}

interface QuoteData {
  available: boolean;
  currency: string;
  nights: number;
  lines: QuoteLine[];
  accommodationCents: number;
  cleaningFeeCents: number;
  taxRateBps: number;
  taxCents: number;
  totalCents: number;
  depositAllowed: boolean;
  depositCents: number;
  balanceCents: number;
  balanceDueDate: string | null;
  minNights: number;
}

type QuoteState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ready"; quote: QuoteData }
  | { kind: "error"; code: string; minNights?: number };

interface Props {
  providers: ("mollie" | "stripe" | "fake")[];
  holdMinutes: number;
}

export function BookingWizard({ providers, holdMinutes }: Props) {
  const t = useTranslations("book");
  const tc = useTranslations("common");
  const locale = useLocale() as "nl" | "en";

  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [arrival, setArrival] = useState<CalendarDate | null>(null);
  const [departure, setDeparture] = useState<CalendarDate | null>(null);
  const [guests, setGuests] = useState(2);
  const [quoteState, setQuoteState] = useState<QuoteState>({ kind: "idle" });
  const [paymentPlan, setPaymentPlan] = useState<"deposit" | "full">("full");
  const [provider, setProvider] = useState(providers[0] ?? "mollie");
  const [guest, setGuest] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const money = useCallback(
    (cents: number, currency = "EUR") =>
      formatCents(cents, { locale: locale === "nl" ? "nl-NL" : "en-IE", currency }),
    [locale],
  );

  // Load a wide availability window once; the calendar pages within it.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const from = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
      const to = addDays(from, 400);
      const response = await fetch(`/api/availability?from=${from}&to=${to}`);
      if (!response.ok || cancelled) return;
      setAvailability(await response.json());
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live quote, requested from the selection handlers (not an effect, which
  // would set state synchronously and cascade renders). A monotonically
  // increasing id discards answers that arrive out of order.
  const quoteRequestId = useRef(0);
  const requestQuote = useCallback(
    (a: CalendarDate | null, d: CalendarDate | null, guestCount: number) => {
      const requestId = ++quoteRequestId.current;
      if (!a || !d) {
        setQuoteState({ kind: "idle" });
        return;
      }
      setQuoteState({ kind: "loading" });
      (async () => {
        try {
          const response = await fetch("/api/quote", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ arrivalDate: a, departureDate: d, guests: guestCount }),
          });
          if (requestId !== quoteRequestId.current) return;
          if (response.ok) {
            const quote: QuoteData = await response.json();
            setQuoteState({ kind: "ready", quote });
            if (!quote.depositAllowed) setPaymentPlan("full");
          } else {
            const body = await response.json().catch(() => null);
            const code = body?.error?.code ?? "GENERIC";
            const match = /minimum of (\d+)/.exec(body?.error?.message ?? "");
            setQuoteState({ kind: "error", code, minNights: match ? Number(match[1]) : undefined });
          }
        } catch {
          if (requestId === quoteRequestId.current) {
            setQuoteState({ kind: "error", code: "GENERIC" });
          }
        }
      })();
    },
    [],
  );

  const detailsComplete =
    guest.firstName.trim() && guest.lastName.trim() && /.+@.+\..+/.test(guest.email);

  const quote = quoteState.kind === "ready" ? quoteState.quote : null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!arrival || !departure || !quote || !detailsComplete) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          arrivalDate: arrival,
          departureDate: departure,
          guests,
          paymentPlan: quote.depositAllowed ? paymentPlan : "full",
          provider,
          expectedTotalCents: quote.totalCents,
          guest: { ...guest, phone: guest.phone || undefined, locale },
          message: message || undefined,
        }),
      });
      const body = await response.json().catch(() => null);
      if (response.ok && body?.checkoutUrl) {
        window.location.assign(body.checkoutUrl);
        return;
      }
      setSubmitError(body?.error?.code ?? "GENERIC");
      setSubmitting(false);
    } catch {
      setSubmitError("GENERIC");
      setSubmitting(false);
    }
  }

  const errorText = useMemo(() => {
    if (quoteState.kind !== "error") return null;
    switch (quoteState.code) {
      case "MIN_NIGHTS_NOT_MET":
        return t("minNightsError", { nights: quoteState.minNights ?? 3 });
      case "NO_RATE_FOR_NIGHT":
        return t("noRate");
      case "RATE_LIMITED":
        return t("errors.RATE_LIMITED");
      default:
        return t("errors.GENERIC");
    }
  }, [quoteState, t]);

  return (
    <form onSubmit={submit} className="grid gap-12 lg:grid-cols-[1fr_380px]">
      <div>
        {/* Step 1: dates */}
        <fieldset>
          <legend className="sr-only">{t("arrival")} / {t("departure")}</legend>
          {availability ? (
            <AvailabilityCalendar
              today={availability.today}
              bookableUntil={availability.bookableUntil}
              unavailable={availability.unavailable}
              arrival={arrival}
              departure={departure}
              onSelect={(a, d) => {
                setArrival(a);
                setDeparture(d);
                requestQuote(a, d, guests);
              }}
            />
          ) : (
            <p className="py-16 text-center text-ink/50">{tc("loading")}</p>
          )}
        </fieldset>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-navy">{t("arrival")}</span>
            <input
              type="text"
              readOnly
              value={arrival ?? ""}
              placeholder="—"
              className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2 tabular-nums"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-navy">{t("departure")}</span>
            <input
              type="text"
              readOnly
              value={departure ?? ""}
              placeholder="—"
              className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2 tabular-nums"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-navy">{t("guestsLabel")}</span>
            <select
              value={guests}
              onChange={(e) => {
                const next = Number(e.target.value);
                setGuests(next);
                requestQuote(arrival, departure, next);
              }}
              className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
            >
              {Array.from({ length: availability?.maxGuests ?? 6 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {tc("guests", { count: n })}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Step 3: details — appear once a quote is on the table. */}
        {quote?.available ? (
          <fieldset className="mt-12">
            <legend className="font-[family-name:var(--font-display)] text-2xl text-navy">
              {t("detailsTitle")}
            </legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-navy">{t("firstName")} *</span>
                <input
                  required
                  autoComplete="given-name"
                  value={guest.firstName}
                  onChange={(e) => setGuest((g) => ({ ...g, firstName: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-navy">{t("lastName")} *</span>
                <input
                  required
                  autoComplete="family-name"
                  value={guest.lastName}
                  onChange={(e) => setGuest((g) => ({ ...g, lastName: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-navy">{t("email")} *</span>
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={guest.email}
                  onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-navy">{t("phone")}</span>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={guest.phone}
                  onChange={(e) => setGuest((g) => ({ ...g, phone: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-navy">{t("message")}</span>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-md border border-navy/20 bg-white px-3 py-2"
                />
              </label>
            </div>

            {quote.depositAllowed ? (
              <fieldset className="mt-8">
                <legend className="text-sm font-medium text-navy">{t("planTitle")}</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${paymentPlan === "deposit" ? "border-turquoise bg-turquoise/5" : "border-navy/20"}`}>
                    <input
                      type="radio"
                      name="plan"
                      checked={paymentPlan === "deposit"}
                      onChange={() => setPaymentPlan("deposit")}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-navy">{t("planDeposit")}</span>
                      <span className="mt-1 block text-sm text-ink/70">
                        {t("payDeposit", { amount: money(quote.depositCents, quote.currency) })}
                        {quote.balanceDueDate ? (
                          <>
                            <br />
                            {t("payDepositRest", {
                              amount: money(quote.balanceCents, quote.currency),
                              date: quote.balanceDueDate,
                            })}
                          </>
                        ) : null}
                      </span>
                    </span>
                  </label>
                  <label className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 ${paymentPlan === "full" ? "border-turquoise bg-turquoise/5" : "border-navy/20"}`}>
                    <input
                      type="radio"
                      name="plan"
                      checked={paymentPlan === "full"}
                      onChange={() => setPaymentPlan("full")}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-medium text-navy">{t("planFull")}</span>
                      <span className="mt-1 block text-sm text-ink/70">
                        {t("payFull", { amount: money(quote.totalCents, quote.currency) })}
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>
            ) : null}

            {providers.length > 1 ? (
              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-navy">{t("providerTitle")}</legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {providers.map((p) => (
                    <label key={p} className={`cursor-pointer rounded-md border px-4 py-2 text-sm font-medium ${provider === p ? "border-turquoise bg-turquoise/5 text-navy" : "border-navy/20 text-ink"}`}>
                      <input
                        type="radio"
                        name="provider"
                        className="sr-only"
                        checked={provider === p}
                        onChange={() => setProvider(p)}
                      />
                      {t(p === "mollie" ? "providerMollie" : p === "stripe" ? "providerStripe" : "providerFake")}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </fieldset>
        ) : null}
      </div>

      {/* The quote card. */}
      <aside aria-live="polite" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-navy p-6 text-sand shadow-lg">
          <h2 className="font-[family-name:var(--font-display)] text-xl">{t("quoteTitle")}</h2>

          {quoteState.kind === "idle" ? (
            <p className="mt-4 text-sm leading-6 text-sand/70">{t("intro")}</p>
          ) : quoteState.kind === "loading" ? (
            <p className="mt-4 text-sm text-sand/70">{tc("loading")}</p>
          ) : quoteState.kind === "error" ? (
            <p className="mt-4 text-sm leading-6 text-terracotta-tint" role="alert">
              {errorText}
            </p>
          ) : !quote!.available ? (
            <p className="mt-4 text-sm leading-6 text-terracotta-tint" role="alert">
              {t("unavailable")}
            </p>
          ) : (
            <>
              <dl className="mt-4 space-y-2 text-sm">
                {quote!.lines.map((line, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <dt className="text-sand/80">
                      {tc("nights", { count: line.nights })} × {money(line.nightlyPriceCents, quote!.currency)}
                    </dt>
                    <dd className="tabular-nums">{money(line.subtotalCents, quote!.currency)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3">
                  <dt className="text-sand/80">{t("cleaningFee")}</dt>
                  <dd className="tabular-nums">{money(quote!.cleaningFeeCents, quote!.currency)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-sand/80">{t("tax", { pct: quote!.taxRateBps / 100 })}</dt>
                  <dd className="tabular-nums">{money(quote!.taxCents, quote!.currency)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex justify-between border-t border-sand/20 pt-4 font-semibold">
                <span>{t("total")}</span>
                <span className="tabular-nums">{money(quote!.totalCents, quote!.currency)}</span>
              </div>

              <button
                type="submit"
                disabled={!detailsComplete || submitting}
                className="btn-primary mt-6 w-full disabled:opacity-60"
              >
                {submitting ? tc("loading") : t("toPayment")}
              </button>
              {submitError ? (
                <p role="alert" className="mt-3 text-sm text-terracotta-tint">
                  {t(
                    submitError === "DATES_UNAVAILABLE" ? "errors.DATES_UNAVAILABLE"
                    : submitError === "QUOTE_MISMATCH" ? "errors.QUOTE_MISMATCH"
                    : submitError === "RATE_LIMITED" ? "errors.RATE_LIMITED"
                    : "errors.GENERIC",
                  )}
                </p>
              ) : null}
              <p className="mt-4 text-xs leading-5 text-sand/60">{t("legalNote")}</p>
              <p className="mt-1 text-xs leading-5 text-sand/60">
                {t("holdNote", { minutes: holdMinutes })}
              </p>
            </>
          )}
        </div>
      </aside>
    </form>
  );
}
