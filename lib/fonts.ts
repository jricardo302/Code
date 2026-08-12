/**
 * Fraunces for headings, Inter for body — self-hosted through next/font so
 * no request ever leaves for Google at runtime (fonts are downloaded at
 * build time and served from /_next/static).
 */

import { Fraunces, Inter } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const fontClasses = `${fraunces.variable} ${inter.variable}`;
