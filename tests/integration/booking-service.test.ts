/**
 * The booking service against a real Postgres — including the race the
 * exclusion constraint exists for. Run via `npm run test:integration`.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { addDays, todayInTimezone } from "@/lib/domain/dates";
import { bookings, blockedDates, properties } from "@/lib/db/schema";
import {
  cancelBooking,
  confirmBooking,
  createBooking,
  expireStaleHolds,
  isStayAvailable,
  unavailableRanges,
  type CreateBookingInput,
} from "@/lib/booking/service";
import { BookingError } from "@/lib/booking/errors";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  pgAvailable,
  seedTestProperty,
  startTestCluster,
  type TestCluster,
} from "./setup-db";

const RUN = pgAvailable();

// Stays are placed far enough out to clear min_advance/max_advance guards.
const today = todayInTimezone();
const arrival = addDays(today, 120);

function stay(offsetDays: number, nights: number, email: string): CreateBookingInput {
  return {
    propertySlug: "lighthouse",
    arrivalDate: addDays(arrival, offsetDays),
    departureDate: addDays(arrival, offsetDays + nights),
    guestCount: 4,
    paymentPlan: "full",
    guest: {
      email,
      firstName: "Test",
      lastName: "Gast",
      locale: "nl",
    },
  };
}

describe.runIf(RUN)("booking service (integration)", () => {
  let cluster: TestCluster;

  beforeAll(async () => {
    cluster = await startTestCluster();
    await seedTestProperty(cluster.db);
  }, 60_000);

  afterAll(() => cluster?.stop());

  it("creates a pending booking with a server-computed price and a hold", async () => {
    const { booking, quote } = await createBooking(cluster.db, stay(0, 7, "a@example.nl"));
    expect(booking.status).toBe("pending");
    expect(booking.reference).toMatch(/^LH-\d{4}-\d{4}$/);
    expect(booking.totalCents).toBe(quote.totalCents);
    expect(booking.totalCents).toBe(
      booking.accommodationCents + booking.cleaningFeeCents + booking.taxCents,
    );
    expect(booking.holdExpiresAt).toBeInstanceOf(Date);
    expect(await isStayAvailable(cluster.db, booking.propertyId, booking.arrivalDate, booking.departureDate)).toBe(false);
  });

  it("loses the race loudly: same nights, one winner, DATES_UNAVAILABLE for the rest", async () => {
    // Ten concurrent attempts at the same week, straight at the database.
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, (_, i) =>
        createBooking(cluster.db, stay(30, 7, `race-${i}@example.nl`)),
      ),
    );
    const won = results.filter((r) => r.status === "fulfilled");
    const lost = results.filter((r) => r.status === "rejected");
    expect(won).toHaveLength(1);
    expect(lost).toHaveLength(9);
    for (const failure of lost) {
      expect((failure as PromiseRejectedResult).reason).toBeInstanceOf(BookingError);
      expect(((failure as PromiseRejectedResult).reason as BookingError).code).toBe(
        "DATES_UNAVAILABLE",
      );
    }
  });

  it("allows back-to-back stays sharing a changeover day", async () => {
    const first = await createBooking(cluster.db, stay(50, 5, "b@example.nl"));
    const second = await createBooking(cluster.db, stay(55, 5, "c@example.nl"));
    expect(first.booking.departureDate).toBe(second.booking.arrivalDate);
  });

  it("refuses dates under an owner block, inside the transaction", async () => {
    const [property] = await cluster.db.select().from(properties).limit(1);
    await cluster.db.insert(blockedDates).values({
      propertyId: property.id,
      startDate: addDays(arrival, 70),
      endDate: addDays(arrival, 77),
      source: "owner",
      reason: "eigen verblijf",
    });
    await expect(createBooking(cluster.db, stay(72, 5, "d@example.nl"))).rejects.toMatchObject({
      code: "DATES_UNAVAILABLE",
    });
  });

  it("confirms exactly once and tolerates webhook replays", async () => {
    const { booking } = await createBooking(cluster.db, stay(90, 5, "e@example.nl"));
    const confirmedOnce = await confirmBooking(cluster.db, booking.id);
    const confirmedTwice = await confirmBooking(cluster.db, booking.id);
    expect(confirmedOnce.status).toBe("confirmed");
    expect(confirmedTwice.confirmedAt?.getTime()).toBe(confirmedOnce.confirmedAt?.getTime());
    expect(confirmedTwice.holdExpiresAt).toBeNull();
  });

  it("releases dates on cancel, and the same week books again", async () => {
    const { booking } = await createBooking(cluster.db, stay(100, 5, "f@example.nl"));
    await cancelBooking(cluster.db, booking.id, "guest request");
    const rebooked = await createBooking(cluster.db, stay(100, 5, "g@example.nl"));
    expect(rebooked.booking.status).toBe("pending");
  });

  it("expires lapsed holds so abandoned checkouts free their nights", async () => {
    const { booking } = await createBooking(cluster.db, stay(110, 5, "h@example.nl"));
    // Nothing lapsed yet.
    expect(await expireStaleHolds(cluster.db)).toHaveLength(0);
    // One hour later the 30-minute hold is gone.
    const expired = await expireStaleHolds(cluster.db, new Date(Date.now() + 3_600_000));
    expect(expired.map((b) => b.id)).toContain(booking.id);
    const again = await createBooking(cluster.db, stay(110, 5, "i@example.nl"));
    expect(again.booking.status).toBe("pending");
  });

  it("will not confirm an expired booking", async () => {
    const [expired] = await cluster.db
      .select()
      .from(bookings)
      .where(eq(bookings.status, "expired"))
      .limit(1);
    await expect(confirmBooking(cluster.db, expired.id)).rejects.toMatchObject({
      code: "INVALID_STATE",
    });
  });

  it("hands out unique sequence-backed references", async () => {
    const refs = await cluster.db.select({ r: bookings.reference }).from(bookings);
    const year = today.slice(0, 4);
    const numbers = refs.map(({ r }) => r).map((r) => Number(r.slice(-4)));
    expect(refs.every(({ r }) => r.startsWith(`LH-${year}-`))).toBe(true);
    expect(numbers.every((n) => Number.isInteger(n) && n >= 1)).toBe(true);
    // Unique even though race losers burned sequence numbers.
    expect(new Set(numbers).size).toBe(numbers.length);
  });

  it("reports unavailable ranges for the calendar, merged and ordered", async () => {
    const [property] = await cluster.db.select().from(properties).limit(1);
    const ranges = await unavailableRanges(
      cluster.db,
      property.id,
      arrival,
      addDays(arrival, 130),
    );
    expect(ranges.length).toBeGreaterThan(2);
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i].startDate >= ranges[i - 1].startDate).toBe(true);
    }
  });

  it("rate limiter: allows up to the limit, then refuses with a retry hint", async () => {
    const results = [];
    for (let i = 0; i < 7; i++) {
      results.push(await checkRateLimit(cluster.db, "booking", "203.0.113.7"));
    }
    expect(results.slice(0, 5).every((r) => r.allowed)).toBe(true);
    expect(results[5].allowed).toBe(false);
    expect(results[5].retryAfterSeconds).toBeGreaterThan(0);
    // A different caller is unaffected.
    expect((await checkRateLimit(cluster.db, "booking", "198.51.100.9")).allowed).toBe(true);
  });
});

describe.runIf(!RUN)("booking service (integration)", () => {
  it.skip("skipped: postgres binaries not found at /usr/lib/postgresql/16", () => {});
});
