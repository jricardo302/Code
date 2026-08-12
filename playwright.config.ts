import { defineConfig, devices } from "@playwright/test";

/**
 * E2E: a production build of the site against a throwaway Postgres
 * (tests/e2e/global-setup.ts), with the fake payment provider enabled so the
 * whole booking flow — calendar to signed webhook to confirmation — runs for
 * real without moving money.
 */

const E2E_DATABASE_URL = "postgres://postgres@127.0.0.1:55440/lighthouse_e2e";
const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // one shared database; bookings interfere across workers
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: "retain-on-failure",
    // The typical guest: Dutch browser. The English test navigates to /en.
    locale: "nl-NL",
    // The environment ships a pinned Chromium; never download browsers.
    launchOptions: { executablePath: "/opt/pw-browsers/chromium" },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}/nl`,
    timeout: 240_000,
    reuseExistingServer: false,
    env: {
      DATABASE_URL: E2E_DATABASE_URL,
      NEXT_PUBLIC_SITE_URL: `http://127.0.0.1:${PORT}`,
      PAYMENT_PROVIDER_FAKE: "1",
      ALLOW_FAKE_PAYMENTS: "1",
      // No RESEND_API_KEY: mails dry-run to the server log.
    },
  },
});
