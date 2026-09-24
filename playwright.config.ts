import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { getBaseUrl, TIMEOUTS, BROWSER_LOCALE } from "./utils/config";
dotenv.config({ quiet: true });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  /* Built-in Playwright HTML reporter — self-contained report, no external service needed. */
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  use: {
    baseURL: getBaseUrl(),
    locale: BROWSER_LOCALE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  expect: {
    timeout: TIMEOUTS.long,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
