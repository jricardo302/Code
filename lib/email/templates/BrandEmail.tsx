/**
 * The shared shell for every guest e-mail: brand colours, Fraunces-ish serif
 * stack for the heading (web fonts are unreliable in e-mail clients, so the
 * stack degrades to Georgia), and the horizon-line motif as a simple bottom
 * border — e-mail-safe, no gradients.
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const brand = {
  navy: "#0B2C3D",
  sand: "#F4EFE6",
  terracotta: "#B4552F",
  turquoise: "#1FA5A0",
  ink: "#1c2b33",
} as const;

export const styles = {
  body: {
    backgroundColor: brand.sand,
    fontFamily:
      "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    color: brand.ink,
    margin: 0,
    padding: "24px 12px",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: "36px 40px",
    maxWidth: 560,
    margin: "0 auto",
  },
  brandline: {
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: brand.terracotta,
    fontWeight: 600,
    margin: "0 0 18px",
  },
  heading: {
    fontFamily: "Fraunces, Georgia, 'Times New Roman', serif",
    fontSize: 26,
    lineHeight: "34px",
    color: brand.navy,
    margin: "0 0 16px",
  },
  text: { fontSize: 15, lineHeight: "24px", margin: "0 0 14px" },
  label: { fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#5c6b73", margin: "0 0 2px" },
  value: { fontSize: 15, fontWeight: 600, color: brand.navy, margin: "0 0 12px" },
  hr: { borderColor: "#e8e2d6", margin: "24px 0" },
  horizon: {
    borderTop: `2px solid ${brand.turquoise}`,
    marginTop: 32,
    paddingTop: 16,
  },
  footer: { fontSize: 12, color: "#5c6b73", lineHeight: "18px", margin: 0 },
} as const;

export function BrandEmail({
  preview,
  heading,
  children,
  footerText,
}: {
  preview: string;
  heading: string;
  children: React.ReactNode;
  footerText: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brandline}>Lighthouse Curaçao</Text>
          <Heading style={styles.heading}>{heading}</Heading>
          {children}
          <Section style={styles.horizon}>
            <Text style={styles.footer}>{footerText}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </>
  );
}

export { Hr, Section, Text };
