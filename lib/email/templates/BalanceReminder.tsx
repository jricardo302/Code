import { Button, Section, Text } from "@react-email/components";
import * as React from "react";
import { formatCents } from "../../domain/money";
import { emailCopy, resolveEmailLocale, type EmailLocale } from "../copy";
import { BrandEmail, DetailRow, brand, styles } from "./BrandEmail";

export interface BalanceReminderProps {
  locale: EmailLocale;
  reference: string;
  arrivalDate: string;
  currency: string;
  balanceCents: number;
  balanceDueDate: string;
  payUrl: string;
}

function formatDate(date: string, locale: "nl" | "en"): string {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function BalanceReminder(props: BalanceReminderProps) {
  const locale = resolveEmailLocale(props.locale);
  const t = emailCopy[locale].balanceReminder;
  const amount = formatCents(props.balanceCents, {
    locale: locale === "nl" ? "nl-NL" : "en-IE",
    currency: props.currency,
  });

  return (
    <BrandEmail
      preview={t.subject(props.reference)}
      heading={t.heading}
      footerText="Lighthouse Curaçao — Kaya Platio 18, Katoentuin, Willemstad, Curaçao"
    >
      <Text style={styles.text}>{t.intro(formatDate(props.arrivalDate, locale), amount)}</Text>
      <DetailRow
        label={emailCopy[locale].confirmation.referenceLabel}
        value={props.reference}
      />
      <Section style={{ margin: "20px 0" }}>
        <Button
          href={props.payUrl}
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
          {t.payButton}
        </Button>
      </Section>
      <Text style={styles.text}>{t.deadline(formatDate(props.balanceDueDate, locale))}</Text>
      <Text style={styles.text}>{t.outro}</Text>
    </BrandEmail>
  );
}

export default BalanceReminder;
