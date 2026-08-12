# Lighthouse Curaçao

Direct-booking site for **Kaya Platio 18, Katoentuin, Willemstad** — a restored
1950s bungalow, 3 bedrooms, sleeps 6, private pool. Guests book and pay here
directly; no platform, no 15,5% host fee.

Stack: Next.js (App Router) · TypeScript strict · Tailwind · Supabase
(Postgres + Auth) · Drizzle ORM · Mollie + Stripe · Resend · Vercel.

---

## Everyday tasks

### Change a price

`/admin → Seizoenen`. Edit the price on the season row, save. Done — the
rates page and every new quote use it immediately. **Existing bookings never
change**: their price was frozen into the booking row when the guest agreed
to it.

### Add a season (or a special-rate week)

`/admin → Seizoenen → Nieuw seizoen`. Give it a name, a start and end date
(both inclusive), a price per night, a minimum stay, and a priority.

- The seed creates seasons through *current year + 2*. Each year, add the new
  year's rows here (or re-run `npm run db:seed`, which tops them up).
- Overlaps are fine — **the highest priority wins**. The standard bands are
  priority 10, so a Christmas-week rate at priority 20 sits on top of high
  season without cutting any bands up.
- A stay's minimum is the **strictest minimum among its nights** (one
  high-season night in a shoulder stay ⇒ the high-season minimum applies).

### Block dates for your own stay

`/admin → Blokkades`. First blocked night + first *free* night (end is
exclusive). Blocks appear in the outgoing iCal feed, so Airbnb/Booking.com
close those dates too.

### Register a payment made by bank transfer

`/admin → Boekingen` → find the booking → "Betaling registreren" with the
amount. A pending booking becomes confirmed and the confirmation e-mail goes
out; on a confirmed booking it simply reduces the open balance.

### Cancel / manual booking / resend confirmation / CSV

All on `/admin → Boekingen`. Cancelling releases the dates instantly (the
database constraint stops caring about cancelled rows). The CSV export is in
the admin header — semicolon-separated, Dutch-Excel-ready.

---

## Connect a payment provider

Both providers hide behind one `PaymentProvider` interface
(`lib/payments/provider.ts`); enabling one is purely environment variables.

**Mollie (primary — iDEAL + cards):**
1. [mollie.com](https://www.mollie.com) → create an organisation, activate
   iDEAL + cards.
2. Dashboard → Developers → API keys → copy the **Live API key**.
3. Set `MOLLIE_API_KEY=live_...` in Vercel → Project → Environment Variables.
4. Webhooks need no configuration: the webhook URL is passed per payment and
   verified by fetching the payment back from Mollie's API.

**Stripe (international fallback):**
1. [stripe.com](https://stripe.com) → activate the account.
2. Developers → API keys → set `STRIPE_SECRET_KEY=sk_live_...`.
3. Developers → Webhooks → add endpoint
   `https://<jouw-domein>/api/webhooks/stripe`, subscribe to
   `checkout.session.completed`, `checkout.session.expired`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed`; copy the signing secret into
   `STRIPE_WEBHOOK_SECRET=whsec_...`.
4. Stripe appears automatically as a second payment option once both
   variables are set.

Test first with `test_`/`sk_test_` keys; the flow is identical. For local
development without any account, set `PAYMENT_PROVIDER_FAKE=1` and use the
fake checkout.

**Safety net you should know about:** the amount is computed on the server
from the database (never from the browser), the webhook re-fetches the
payment from the provider before trusting it, and a paid amount that differs
from the stored amount freezes the payment instead of confirming the booking.

---

## Rotate the API keys

Rotation is: create the new secret at the provider, update the environment
variable in Vercel, redeploy, then revoke the old secret. Order matters —
never revoke first.

| Key | Where to create the new one | Then |
|---|---|---|
| `MOLLIE_API_KEY` | Mollie Dashboard → Developers → API keys → regenerate | Update in Vercel, redeploy, done (old key stops working on regenerate — do this in a quiet hour) |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API keys → "Roll key" (grace period selectable) | Update in Vercel, redeploy, roll completes itself |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Webhooks → endpoint → "Roll secret" | Update in Vercel, redeploy |
| `RESEND_API_KEY` | Resend → API Keys → create new | Update in Vercel, redeploy, delete the old key |
| `DATABASE_URL` (Supabase db password) | Supabase → Settings → Database → reset password | Update in Vercel **and** in your local `.env.local`, redeploy |
| `SUPABASE anon key` | Supabase → Settings → API → rotate | Update `NEXT_PUBLIC_SUPABASE_ANON_KEY`, redeploy |
| `CRON_SECRET` / `ICAL_FEED_TOKEN` | invent a new value (`openssl rand -hex 24`) | Update in Vercel, redeploy; for the iCal token also paste the new feed URL into Airbnb/Booking.com |

After any rotation: make one test booking with the fake provider or a €0.01
test payment and check `/admin` — five minutes that catch a bad paste.

---

## Local development

```bash
cp .env.example .env.local        # fill in at least DATABASE_URL
npm install
npm run db:migrate                # applies drizzle/ migrations
npm run db:seed                   # property + Curaçao seasons (idempotent)
npm run dev
```

No Supabase yet? Set `ADMIN_DEV_PASSWORD` for a dev-only admin login. No
Resend key? Mails print to the console. No Mollie/Stripe? Set
`PAYMENT_PROVIDER_FAKE=1` and pay on the built-in fake checkout.

### Tests

```bash
npm test                  # unit: dates, money, pricing, iCal parsing
npm run test:integration  # real Postgres 16: booking races, payments, feed sync
npm run test:e2e          # Playwright: the full booking flow in a browser
```

The integration and E2E suites boot their own throwaway Postgres (needs the
`postgresql-16` server binaries; both suites skip with a clear message
without them).

---

## How the important parts work

- **Money** is integer cents everywhere; rates are basis points (700 = 7%).
  Floats never touch an amount (`lib/domain/money.ts`).
- **Dates** are plain `YYYY-MM-DD` strings in the house's timezone. A stay is
  `[arrival, departure)` — the departure day is free for the next arrival
  (`lib/domain/dates.ts`).
- **Double bookings are impossible at the database.** A btree_gist
  `EXCLUDE`-constraint on `(property_id, stay)` rejects any overlap between
  live bookings; two guests racing for the same week produce exactly one
  winner and one clean "just taken" error (`drizzle/0001`).
- **Pricing is server-authoritative.** The browser shows a quote; the server
  recomputes it at booking time and the payment amount is checked against the
  stored booking before *and* after payment (`lib/domain/pricing.ts`,
  `lib/payments/service.ts`).
- **Webhooks** are signature-verified (Stripe), fetch-back-verified (Mollie),
  idempotent (terminal states never regress) and replay-safe.
- **The hourly cron** (`/api/cron`, Vercel Cron, `CRON_SECRET` bearer)
  expires unpaid holds, sends the balance reminder (35 days out) and the
  arrival e-mail (3 days out), mirrors the Airbnb/Booking.com iCal feeds into
  `blocked_dates` (source = feed label, never confused with your own blocks),
  and sweeps rate-limit rows.
- **E-mail** sends exactly once per event: the `*_sent_at` column is claimed
  in a guarded UPDATE before Resend is called, and released on failure so the
  next cron retries.
- **Audit log**: every admin action and money-moving webhook writes an
  `audit_log` row — who, what, before, after.

## Deploy (Vercel)

1. Import the repo in Vercel; framework auto-detects.
2. Set the environment variables from `.env.example` (production values).
3. `vercel.json` already schedules `/api/cron` hourly; set `CRON_SECRET`.
4. Migrations: `npm run db:migrate` against the **direct** (non-pooled)
   Supabase connection string — run locally or in CI, not in the build.
5. Supabase Auth → create the one admin user (e-mail = `ADMIN_EMAIL`),
   disable public sign-ups.

## Images

`public/images/*` currently holds generated placeholder art
(`scripts/make-placeholders.ts`). Replace each file with a real photo under
the same name — `hero.jpg` (2400×1350), `og.jpg` (1200×630), the rest
2400×1350 — and everything (blur placeholders, AVIF/WebP, lazy loading)
keeps working. Photos of the actual house sell nights; do this before launch.

## Notes

- `archive/ik-zie-ik-zie/` is the previous project that lived in this repo,
  parked untouched.
- `npm audit` reports a moderate advisory in drizzle-kit's bundled esbuild —
  a **dev-time** dependency (never deployed); upgrade drizzle-kit when a fix
  lands rather than forcing a downgrade.
- Papiamentu is prepared: add `pap` to `i18n/routing.ts`, create
  `messages/pap.json`, fill the `pap` cases in `lib/email/copy.ts`.
