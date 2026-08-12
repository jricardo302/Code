/**
 * The booking flow, end to end: pick dates in the ARIA calendar, get a live
 * quote, leave guest details, pay on the fake provider's checkout, land on
 * the confirmation. Plus the two failure paths that matter most: a failed
 * payment (retryable) and a double booking (refused).
 */

import { expect, test, type Page } from "@playwright/test";

/** A free stretch far enough out to clear min-advance and season minimums. */
function pickDates(offsetDays: number, nights: number): { arrival: string; departure: string } {
  const arrival = new Date();
  arrival.setDate(arrival.getDate() + offsetDays);
  const departure = new Date(arrival);
  departure.setDate(departure.getDate() + nights);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { arrival: iso(arrival), departure: iso(departure) };
}

async function navigateCalendarTo(page: Page, date: string): Promise<void> {
  // Page forward until the target month is on screen (two months visible).
  for (let i = 0; i < 20; i++) {
    if (await page.locator(`[data-date="${date}"]`).count()) return;
    await page.getByRole("button", { name: /volgende maand|next month/i }).click();
  }
  throw new Error(`date ${date} never became visible`);
}

async function selectStay(page: Page, arrival: string, departure: string): Promise<void> {
  await navigateCalendarTo(page, arrival);
  await page.locator(`[data-date="${arrival}"]`).click();
  await navigateCalendarTo(page, departure);
  await page.locator(`[data-date="${departure}"]`).click();
  await expect(page.locator('input[readonly]').first()).toHaveValue(arrival);
}

async function fillGuestDetails(page: Page, email: string): Promise<void> {
  await page.getByLabel(/voornaam/i).fill("Emma");
  await page.getByLabel(/achternaam/i).fill("de Vries");
  await page.getByLabel(/e-mailadres/i).fill(email);
}

test("guest books, pays on the fake checkout and sees the confirmation", async ({ page }) => {
  const { arrival, departure } = pickDates(120, 7);
  await page.goto("/boeken");

  await selectStay(page, arrival, departure);

  // Live quote appears with a total.
  const quoteCard = page.getByRole("complementary");
  await expect(quoteCard.getByText(/totaal/i)).toBeVisible();
  await expect(quoteCard.getByText(/eindschoonmaak/i)).toBeVisible();
  await expect(quoteCard.getByText(/logeerbelasting/i)).toBeVisible();

  await fillGuestDetails(page, "emma@example.nl");
  await page.getByRole("button", { name: /naar de betaling/i }).click();

  // The fake provider's checkout.
  await page.waitForURL(/\/betalen\/fake\//);
  await expect(page.getByText(/testbetaling/i)).toBeVisible();
  await page.getByTestId("fake-pay").click();

  // Confirmation, with the booking reference.
  await page.waitForURL(/\/boeken\/status\//);
  await expect(page.getByRole("heading", { name: /bevestigd/i })).toBeVisible();
  await expect(page.getByText(/LH-\d{4}-\d{4}/).first()).toBeVisible();
});

test("failed payment leaves the guest able to retry", async ({ page }) => {
  const { arrival, departure } = pickDates(150, 6);
  await page.goto("/boeken");
  await selectStay(page, arrival, departure);
  await fillGuestDetails(page, "retry@example.nl");
  await page.getByRole("button", { name: /naar de betaling/i }).click();

  await page.waitForURL(/\/betalen\/fake\//);
  await page.getByTestId("fake-fail").click();

  await page.waitForURL(/\/boeken\/status\//);
  await expect(page.getByRole("button", { name: /opnieuw proberen/i })).toBeVisible();
});

test("the same nights cannot be booked twice", async ({ page }) => {
  const { arrival, departure } = pickDates(200, 5);

  // First booking, completed.
  await page.goto("/boeken");
  await selectStay(page, arrival, departure);
  await fillGuestDetails(page, "first@example.nl");
  await page.getByRole("button", { name: /naar de betaling/i }).click();
  await page.waitForURL(/\/betalen\/fake\//);
  await page.getByTestId("fake-pay").click();
  await page.waitForURL(/\/boeken\/status\//);

  // Second attempt on the same nights: the calendar already shows them
  // taken; the aria-disabled marking is the guard rail we assert.
  await page.goto("/boeken");
  await navigateCalendarTo(page, arrival);
  await expect(page.locator(`[data-date="${arrival}"]`)).toHaveAttribute("aria-disabled", "true");
});

test("keyboard-only date selection works in the ARIA grid", async ({ page }) => {
  const { arrival } = pickDates(240, 5);
  await page.goto("/boeken");
  await navigateCalendarTo(page, arrival);

  const cell = page.locator(`[data-date="${arrival}"]`);
  await cell.focus();
  // Select arrival with Enter, walk five nights with ArrowRight, close the
  // range with Space.
  await page.keyboard.press("Enter");
  for (let i = 0; i < 5; i++) await page.keyboard.press("ArrowRight");
  await page.keyboard.press(" ");

  const quoteCard = page.getByRole("complementary");
  await expect(quoteCard.getByText(/totaal/i)).toBeVisible();
  await expect(quoteCard.getByText(/5\s*nachten/i)).toBeVisible();
});

test("English locale renders and quotes in English", async ({ page }) => {
  const { arrival, departure } = pickDates(280, 5);
  await page.goto("/en/book");
  await expect(page.getByRole("heading", { name: /^book$/i })).toBeVisible();
  await navigateCalendarTo(page, arrival);
  await page.locator(`[data-date="${arrival}"]`).click();
  await navigateCalendarTo(page, departure);
  await page.locator(`[data-date="${departure}"]`).click();
  await expect(page.getByRole("complementary").getByText(/total/i)).toBeVisible();
  await expect(page.getByRole("complementary").getByText(/final cleaning/i)).toBeVisible();
});
