/**
 * Shared plumbing for the public API routes: typed error responses, the
 * rate-limit gate, and zod parsing that answers 400 instead of throwing.
 */

import { NextResponse } from "next/server";
import type { ZodType } from "zod";
import { BookingError } from "../booking/errors";
import { PricingError } from "../domain/pricing";
import { getDb } from "../db/client";
import { checkRateLimit, clientKeyFromHeaders, RATE_LIMITS } from "../rate-limit";

export function jsonError(
  status: number,
  code: string,
  message: string,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json({ error: { code, message, ...extra } }, { status });
}

/**
 * Gate a route on the Postgres rate limiter. Returns the 429 to send, or
 * null to proceed. Fails closed on database trouble: a quote endpoint that
 * cannot reach the database cannot serve quotes anyway.
 */
export async function rateLimitGate(
  scope: keyof typeof RATE_LIMITS,
  headers: Headers,
): Promise<NextResponse | null> {
  const result = await checkRateLimit(getDb(), scope, clientKeyFromHeaders(headers));
  if (result.allowed) return null;
  return NextResponse.json(
    { error: { code: "RATE_LIMITED", message: "Too many requests" } },
    {
      status: 429,
      headers: { "Retry-After": String(result.retryAfterSeconds) },
    },
  );
}

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { ok: false, response: jsonError(400, "INVALID_JSON", "Body must be JSON") };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonError(400, "INVALID_INPUT", "Invalid request", {
        issues: parsed.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      }),
    };
  }
  return { ok: true, data: parsed.data };
}

/** Domain errors to HTTP, with codes the client's i18n layer translates. */
export function domainErrorResponse(error: unknown): NextResponse | null {
  if (error instanceof PricingError) {
    const status = error.code === "NO_RATE_FOR_NIGHT" ? 409 : 422;
    return jsonError(status, error.code, error.message, { dates: error.dates });
  }
  if (error instanceof BookingError) {
    const status =
      error.code === "DATES_UNAVAILABLE" ? 409
      : error.code === "PROPERTY_NOT_FOUND" || error.code === "BOOKING_NOT_FOUND" ? 404
      : 422;
    return jsonError(status, error.code, error.message);
  }
  return null;
}
