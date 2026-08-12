/**
 * Fixed-window rate limiting backed by Postgres, so limits hold across
 * serverless instances without adding Redis to a one-person stack.
 *
 * One atomic upsert per request: insert the (key, window) row or bump its
 * counter, returning the new count. No read-then-write race. A tidy-up in the
 * cron route deletes windows older than an hour.
 */

import { sql } from "drizzle-orm";
import type { Db } from "./db/client";
import { rateLimits } from "./db/schema";

export interface RateLimitRule {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

/** Public endpoints get budgets a real guest never hits. */
export const RATE_LIMITS = {
  /** Live quotes while a guest plays with the calendar. */
  quote: { limit: 60, windowSeconds: 60 },
  /** Creating bookings — expensive and abusable, so tight. */
  booking: { limit: 5, windowSeconds: 600 },
  /** Contact form. */
  contact: { limit: 5, windowSeconds: 600 },
} satisfies Record<string, RateLimitRule>;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets; feeds the Retry-After header. */
  retryAfterSeconds: number;
}

export async function checkRateLimit(
  db: Db,
  scope: keyof typeof RATE_LIMITS,
  clientKey: string,
  now = new Date(),
): Promise<RateLimitResult> {
  const rule = RATE_LIMITS[scope];
  const windowMs = rule.windowSeconds * 1000;
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const key = `${scope}:${clientKey}`;

  const [row] = await db
    .insert(rateLimits)
    .values({ key, windowStart, count: 1 })
    .onConflictDoUpdate({
      target: [rateLimits.key, rateLimits.windowStart],
      set: { count: sql`${rateLimits.count} + 1` },
    })
    .returning({ count: rateLimits.count });

  const count = row?.count ?? rule.limit + 1;
  const resetMs = windowStart.getTime() + windowMs - now.getTime();
  return {
    allowed: count <= rule.limit,
    remaining: Math.max(0, rule.limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil(resetMs / 1000)),
  };
}

/** Cron tidy-up: drop windows nothing will ever read again. */
export async function sweepRateLimits(db: Db, now = new Date()): Promise<void> {
  const cutoff = new Date(now.getTime() - 3_600_000);
  await db.delete(rateLimits).where(sql`${rateLimits.windowStart} < ${cutoff}`);
}

/**
 * The client key: the leftmost public IP Vercel reports. Falls back to a
 * shared bucket rather than failing open per-request.
 */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
