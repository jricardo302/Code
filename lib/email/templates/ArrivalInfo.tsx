import { Heading, Text } from "@react-email/components";
import * as React from "react";
import { emailCopy, resolveEmailLocale, type EmailLocale } from "../copy";
import { BrandEmail, brand, styles } from "./BrandEmail";

export interface ArrivalInfoProps {
  locale: EmailLocale;
  arrivalDate: string;
  checkInTime: string;
}

const subheading = {
  fontFamily: "Fraunces, Georgia, 'Times New Roman', serif",
  fontSize: 18,
  color: brand.navy,
  margin: "20px 0 6px",
} as const;

function formatDate(date: string, locale: "nl" | "en"): string {
  return new Intl.DateTimeFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function ArrivalInfo(props: ArrivalInfoProps) {
  const locale = resolveEmailLocale(props.locale);
  const t = emailCopy[locale].arrival;

  return (
    <BrandEmail
      preview={t.subject}
      heading={t.heading}
      footerText="Lighthouse Curaçao — Kaya Platio 18, Katoentuin, Willemstad, Curaçao"
    >
      <Text style={styles.text}>{t.intro(formatDate(props.arrivalDate, locale))}</Text>

      <Heading as="h2" style={subheading}>{t.directionsHeading}</Heading>
      <Text style={styles.text}>{t.directions}</Text>

      <Heading as="h2" style={subheading}>{t.keysHeading}</Heading>
      <Text style={styles.text}>{t.keys(props.checkInTime)}</Text>

      <Heading as="h2" style={subheading}>{t.wifiHeading}</Heading>
      <Text style={styles.text}>{t.wifi}</Text>

      <Heading as="h2" style={subheading}>{t.poolHeading}</Heading>
      <Text style={styles.text}>{t.pool}</Text>

      <Text style={styles.text}>{t.outro}</Text>
    </BrandEmail>
  );
}

export default ArrivalInfo;
