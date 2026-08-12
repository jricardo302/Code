/**
 * POST /api/quote — a live, non-binding quote for the search form.
 *
 * Availability and price in one round trip. The response is for display;
 * nothing here is trusted at booking time — the server recomputes everything
 * in /api/bookings.
 */

import { NextResponse } from "next/server";
import {
  domainErrorResponse,
  jsonError,
  parseJsonBody,
  rateLimitGate,
} from "@/lib/api/http";
import { quoteRequestSchema } from "@/lib/api/schemas";
import {
  assertBookableWindow,
  isStayAvailable,
  loadPricingContext,
} from "@/lib/booking/service";
import { getDb } from "@/lib/db/client";
import { computeQuote } from "@/lib/domain/pricing";
import { PROPERTY_SLUG } from "@/lib/site-config";

export async function POST(request: Request): Promise<NextResponse> {
  const limited = await rateLimitGate("quote", request.headers);
  if (limited) return limited;

  const parsed = await parseJsonBody(request, quoteRequestSchema);
  if (!parsed.ok) return parsed.response;
  const { arrivalDate, departureDate, guests } = parsed.data;

  const db = getDb();
  try {
    const ctx = await loadPricingContext(db, PROPERTY_SLUG);
    if (guests > ctx.property.maxGuests) {
      return jsonError(422, "TOO_MANY_GUESTS", `Sleeps at most ${ctx.property.maxGuests}`);
    }
    assertBookableWindow(ctx, arrivalDate);

    const quote = computeQuote(
      ctx.policy,
      ctx.seasons,
      { arrivalDate, departureDate },
      { today: ctx.today },
    );
    const available = await isStayAvailable(db, ctx.property.id, arrivalDate, departureDate);

    return NextResponse.json({
      available,
      currency: quote.currency,
      nights: quote.nights,
      lines: quote.lines,
      accommodationCents: quote.accommodationCents,
      cleaningFeeCents: quote.cleaningFeeCents,
      taxRateBps: quote.taxRateBps,
      taxCents: quote.taxCents,
      totalCents: quote.totalCents,
      depositAllowed: quote.depositAllowed,
      depositCents: quote.depositCents,
      balanceCents: quote.balanceCents,
      balanceDueDate: quote.balanceDueDate,
      minNights: quote.minNights,
    });
  } catch (error) {
    const known = domainErrorResponse(error);
    if (known) return known;
    console.error("[api/quote]", error);
    return jsonError(500, "INTERNAL", "Something went wrong");
  }
}
