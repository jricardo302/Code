/**
 * Wire formats for the public API, as zod schemas. Anything not listed here
 * does not enter the system.
 */

import { z } from "zod";
import { isCalendarDate } from "../domain/dates";

export const calendarDateSchema = z
  .string()
  .refine(isCalendarDate, "must be a YYYY-MM-DD calendar date");

export const localeSchema = z.enum(["nl", "en", "pap"]);

export const quoteRequestSchema = z.object({
  arrivalDate: calendarDateSchema,
  departureDate: calendarDateSchema,
  guests: z.number().int().min(1).max(20),
});
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export const bookingRequestSchema = z.object({
  arrivalDate: calendarDateSchema,
  departureDate: calendarDateSchema,
  guests: z.number().int().min(1).max(20),
  paymentPlan: z.enum(["deposit", "full"]),
  provider: z.enum(["mollie", "stripe", "fake"]),
  /**
   * The total the guest saw on screen. Purely a guard: the server recomputes
   * its own total and refuses if the two differ, so a guest never gets
   * charged an amount they weren't shown.
   */
  expectedTotalCents: z.number().int().positive(),
  guest: z.object({
    email: z.string().trim().toLowerCase().pipe(z.email()),
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    phone: z.string().trim().max(40).optional(),
    country: z.string().length(2).optional(),
    locale: localeSchema,
  }),
  message: z.string().trim().max(2000).optional(),
});
export type BookingRequest = z.infer<typeof bookingRequestSchema>;
