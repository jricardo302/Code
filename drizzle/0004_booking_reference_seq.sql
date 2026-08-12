-- Booking references are numbered from a sequence, not from count(*): two
-- transactions that count concurrently mint the same number and the loser
-- dies on the unique index for no good reason. nextval() is atomic. Gaps
-- (rolled-back attempts) are harmless in a human-facing reference.
CREATE SEQUENCE IF NOT EXISTS booking_reference_seq START 1;
