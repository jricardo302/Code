-- Double-booking is prevented here, not in application code.
--
-- `stay` and `during` are generated daterange columns (see lib/db/schema.ts).
-- The two EXCLUDE constraints below make Postgres reject any insert or update
-- that would let two live bookings — or a live booking and nothing else; blocks
-- are checked in the transaction — claim the same night. Under a race between
-- two guests, the loser gets error 23P01 (exclusion_violation), which the
-- booking endpoint translates into "these dates were just taken".
--
-- Cancelled and expired bookings keep their rows (history, refunds) but drop
-- out of the constraint via the WHERE clause, so their dates are open for
-- rebooking immediately.

CREATE EXTENSION IF NOT EXISTS btree_gist;
--> statement-breakpoint

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_no_overlap"
  EXCLUDE USING gist (
    "property_id" WITH =,
    "stay" WITH &&
  )
  WHERE (status NOT IN ('cancelled', 'expired'));
--> statement-breakpoint

-- Owner blocks may not overlap each other either; imported feeds are exempt
-- (Airbnb and Booking.com regularly publish overlapping busy ranges, and the
-- importer must be able to mirror them verbatim).
ALTER TABLE "blocked_dates"
  ADD CONSTRAINT "blocked_dates_owner_no_overlap"
  EXCLUDE USING gist (
    "property_id" WITH =,
    "during" WITH &&
  )
  WHERE (source = 'owner');
