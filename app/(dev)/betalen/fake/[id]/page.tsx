/**
 * The fake provider's "checkout page" — dev and E2E only. The buttons do
 * what a real provider does: settle the payment on the provider side, fire
 * our own webhook (signed), then redirect back. The whole confirmation path
 * runs for real.
 */

import { notFound, redirect } from "next/navigation";
import { getPaymentProvider } from "@/lib/payments/registry";
import { fakeSignature, settleFakePayment } from "@/lib/payments/fake";
import { getDb } from "@/lib/db/client";
import { processWebhook } from "@/lib/payments/service";
import { sendBookingConfirmation } from "@/lib/email/send";
import { formatCents } from "@/lib/domain/money";

export const dynamic = "force-dynamic";

function assertEnabled(): void {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_FAKE_PAYMENTS !== "1") {
    notFound();
  }
}

async function settle(id: string, outcome: "paid" | "failed"): Promise<string> {
  "use server";
  assertEnabled();
  settleFakePayment(id, outcome);
  // Fire our webhook exactly like a provider would — through the service,
  // with a valid signature over the body.
  const body = `id=${id}`;
  const provider = getPaymentProvider("fake");
  const db = getDb();
  const result = await processWebhook(
    db,
    provider,
    body,
    new Headers({ "x-fake-signature": fakeSignature(body) }),
  );
  if (result.confirmedBooking) {
    try {
      await sendBookingConfirmation(db, result.confirmedBooking.id);
    } catch (error) {
      console.error("[fake-checkout] confirmation e-mail failed", error);
    }
  }
  // Redirect target mirrors what the real providers got as redirectUrl.
  const stored = await db.query.payments.findFirst({
    where: (p, { eq }) => eq(p.providerPaymentId, id),
  });
  return stored ? `/boeken/status/${stored.bookingId}` : "/";
}

export default async function FakeCheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  assertEnabled();
  const { id } = await params;

  // Amount from our own payment row — the page is part of the dev loop.
  const stored = await getDb().query.payments.findFirst({
    where: (p, { eq }) => eq(p.providerPaymentId, id),
  });
  if (!stored) notFound();
  const amountLabel = formatCents(stored.amountCents, { currency: stored.currency });

  async function pay(): Promise<void> {
    "use server";
    const target = await settle(id, "paid");
    redirect(target);
  }
  async function fail(): Promise<void> {
    "use server";
    const target = await settle(id, "failed");
    redirect(target);
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl">Testbetaling</h1>
      <p className="text-ink/70">
        Dit is de nep-betaalpagina van de <code>fake</code> provider. Alleen voor
        ontwikkeling en tests — er beweegt geen echt geld.
      </p>
      <p className="font-mono text-sm text-ink/60">{id}</p>
      <div className="flex gap-4">
        <form action={pay}>
          <button type="submit" className="btn-primary" data-testid="fake-pay">
            Betaal {amountLabel}
          </button>
        </form>
        <form action={fail}>
          <button type="submit" className="btn-secondary" data-testid="fake-fail">
            Laat mislukken
          </button>
        </form>
      </div>
    </main>
  );
}
