/**
 * POST /api/bookings — the binding step.
 *
 * Creates the pending booking (server-priced, transactional, race-safe) and
 * the provider payment, and hands back the checkout URL. The client's
 * `expectedTotalCents` is only a guard: if it differs from the server's own
 * total, the answer is 409 QUOTE_MISMATCH and nothing is created — the guest
 * saw a stale price and must see the current one before agreeing to it.
 */

import { NextResponse } from "next/server";
import {
  domainErrorResponse,
  jsonError,
  parseJsonBody,
  rateLimitGate,
} from "@/lib/api/http";
import { bookingRequestSchema } from "@/lib/api/schemas";
import { audit } from "@/lib/booking/audit";
import { cancelBooking, createBooking } from "@/lib/booking/service";
import { getDb } from "@/lib/db/client";
import { clientKeyFromHeaders } from "@/lib/rate-limit";
import { enabledProviders, getPaymentProvider } from "@/lib/payments/registry";
import { startPayment } from "@/lib/payments/service";
import { PROPERTY_SLUG } from "@/lib/site-config";

export async function POST(request: Request): Promise<NextResponse> {
  const limited = await rateLimitGate("booking", request.headers);
  if (limited) return limited;

  const parsed = await parseJsonBody(request, bookingRequestSchema);
  if (!parsed.ok) return parsed.response;
  const input = parsed.data;

  if (!enabledProviders().includes(input.provider)) {
    return jsonError(422, "PROVIDER_DISABLED", "This payment method is not available");
  }

  const db = getDb();
  try {
    const { booking, quote } = await createBooking(db, {
      propertySlug: PROPERTY_SLUG,
      arrivalDate: input.arrivalDate,
      departureDate: input.departureDate,
      guestCount: input.guests,
      paymentPlan: input.paymentPlan,
      guest: input.guest,
      guestMessage: input.message,
      source: "direct",
    });

    // The price the guest agreed to must be the price we computed. If not,
    // undo the hold immediately — never charge an unseen amount.
    if (input.expectedTotalCents !== quote.totalCents) {
      await cancelBooking(db, booking.id, "quote mismatch at submission");
      return jsonError(409, "QUOTE_MISMATCH", "The price has changed; please review the new total", {
        totalCents: quote.totalCents,
      });
    }

    const provider = getPaymentProvider(input.provider);
    const step = input.paymentPlan === "deposit" ? "deposit" : "full";
    const { checkoutUrl } = await startPayment(db, provider, booking, step);

    await audit(db, {
      actor: "guest",
      action: "booking.created",
      entity: "booking",
      entityId: booking.id,
      after: {
        reference: booking.reference,
        arrivalDate: booking.arrivalDate,
        departureDate: booking.departureDate,
        totalCents: booking.totalCents,
      },
      ip: clientKeyFromHeaders(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.json(
      {
        bookingId: booking.id,
        reference: booking.reference,
        status: booking.status,
        totalCents: booking.totalCents,
        checkoutUrl,
        holdExpiresAt: booking.holdExpiresAt,
      },
      { status: 201 },
    );
  } catch (error) {
    const known = domainErrorResponse(error);
    if (known) return known;
    console.error("[api/bookings]", error);
    return jsonError(500, "INTERNAL", "Something went wrong");
  }
}
