/**
 * Shared webhook route body for all providers. Reads the raw body (never a
 * parsed one — signatures are over bytes), lets the payment service decide,
 * and fires the confirmation e-mail when this webhook was the one that
 * completed a booking. E-mail failures never fail the webhook: the provider
 * would retry and re-run a flow that already succeeded; the cron re-sends
 * unsent confirmations instead.
 */

import { NextResponse } from "next/server";
import { getDb } from "../db/client";
import { sendBookingConfirmation } from "../email/send";
import { getPaymentProvider } from "../payments/registry";
import { processWebhook } from "../payments/service";
import type { ProviderName } from "../payments/provider";

export async function handleProviderWebhook(
  providerName: ProviderName,
  request: Request,
): Promise<NextResponse> {
  const db = getDb();
  const provider = getPaymentProvider(providerName);
  const rawBody = await request.text();

  const outcome = await processWebhook(db, provider, rawBody, request.headers);

  if (outcome.confirmedBooking) {
    try {
      await sendBookingConfirmation(db, outcome.confirmedBooking.id);
    } catch (error) {
      console.error(
        `[webhook:${providerName}] confirmation e-mail failed for ${outcome.confirmedBooking.id}`,
        error,
      );
    }
  }

  // Providers only need the status; bodies are for humans reading logs.
  return new NextResponse(outcome.note, { status: outcome.httpStatus });
}
