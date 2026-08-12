/**
 * Human-facing booking references: LH-2027-0042.
 *
 * The number comes from a Postgres sequence, so concurrent bookings can never
 * mint the same reference — count(*)-based numbering makes two simultaneous
 * transactions collide on the unique index. Sequence gaps (rolled-back
 * attempts) are harmless in a reference a guest reads over the phone; the
 * year prefix is there for your filing, not for arithmetic.
 */

import { sql } from "drizzle-orm";
import type { Db } from "../db/client";
import type { CalendarDate } from "../domain/dates";

/** Structural subset shared by the db handle and a transaction handle. */
type Queryable = Pick<Db, "execute">;

export async function newBookingReference(
  tx: Queryable,
  today: CalendarDate,
): Promise<string> {
  const year = today.slice(0, 4);
  const rows = await tx.execute(
    sql`select nextval('booking_reference_seq') as n`,
  );
  const next = Number((rows as unknown as { n: string | number }[])[0]!.n);
  return `LH-${year}-${String(next).padStart(4, "0")}`;
}
