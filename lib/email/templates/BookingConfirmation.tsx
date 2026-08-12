import { Button, Hr, Section, Text } from "@react-email/components";
import * as React from "react";
import { formatCents } from "../../domain/money";
import type { Quote, QuoteLine } from "../../domain/pricing";
import { emailCopy, resolveEmailLocale, type EmailLocale } from "../copy";
import { BrandEmail, DetailRow, brand, styles } from "./BrandEmail";

export interface BookingConfirmationProps {
  locale: EmailLocale;
  reference: string;
  arrivalDate: string;
  departureDate: string;
  guests: number;
  currency: string;
  lines: QuoteLine[];
  cleaningFeeCents: number;
  taxRateBps: number;
  taxCents: number;
  totalCents: number;
  paidCents: number;
  balanceCents: number;
  balanceDueDate: string | null;
  statusUrl: string;
}

function formatDate(date: string, locale: "nl" | "en"): string {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function BookingConfirmation(props: BookingConfirmationProps) {
  const locale = resolveEmailLocale(props.locale);
  const t = emailCopy[locale].confirmation;
  const money = (cents: number) =>
    formatCents(cents, { locale: locale === "nl" ? "nl-NL" : "en-IE", currency: props.currency });

  return (
    <BrandEmail
      preview={t.subject(props.reference)}
      heading={t.heading}
      footerText="Lighthouse Curaçao — Kaya Platio 18, Katoentuin, Willemstad, Curaçao"
    >
      <Text style={styles.text}>{t.intro}</Text>

      <DetailRow
        label={t.datesLabel}
        value={`${formatDate(props.arrivalDate, locale)} → ${formatDate(props.departureDate, locale)}`}
      />
      <DetailRow label={t.guestsLabel} value={String(props.guests)} />
      <DetailRow label={t.referenceLabel} value={props.reference} />

      <Hr style={styles.hr} />
      <Text style={{ ...styles.label, marginBottom: 8 }}>{t.breakdownHeading}</Text>
      {props.lines.map((line, i) => (
        <Text key={i} style={{ ...styles.text, margin: "0 0 4px" }}>
          {t.nights(line.nights, money(line.nightlyPriceCents))} — {money(line.subtotalCents)}
        </Text>
      ))}
      <Text style={{ ...styles.text, margin: "0 0 4px" }}>
        {t.cleaningFee} — {money(props.cleaningFeeCents)}
      </Text>
      <Text style={{ ...styles.text, margin: "0 0 4px" }}>
        {t.tax((props.taxRateBps / 100).toLocaleString(locale === "nl" ? "nl-NL" : "en-GB"))} —{" "}
        {money(props.taxCents)}
      </Text>
      <Text style={{ ...styles.text, fontWeight: 700, color: brand.navy, margin: "8px 0 4px" }}>
        {t.total}: {money(props.totalCents)}
      </Text>
      <Text style={{ ...styles.text, margin: "0 0 4px" }}>
        {t.paid}: {money(props.paidCents)}
      </Text>
      <Text style={styles.text}>
        {props.balanceCents > 0 && props.balanceDueDate
          ? `${t.balance(formatDate(props.balanceDueDate, locale))}: ${money(props.balanceCents)}`
          : t.balanceNone}
      </Text>

      {props.balanceCents > 0 ? (
        <Section style={{ margin: "20px 0" }}>
          <Button
            href={props.statusUrl}
            style={{
              backgroundColor: brand.terracotta,
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {emailCopy[locale].balanceReminder.payButton}
          </Button>
        </Section>
      ) : null}

      <Text style={styles.text}>{t.icsHint}</Text>
      <Text style={styles.text}>{t.outro}</Text>
      <Text style={{ ...styles.text, whiteSpace: "pre-line" }}>{t.signature}</Text>
    </BrandEmail>
  );
}

export default BookingConfirmation;
