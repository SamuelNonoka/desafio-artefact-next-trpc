import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const E2E_DATABASE_URL = "file:./e2e.db";

export default defineConfig({
  testDir: "./e2e",
  // Shared database: run sequentially
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  // next dev compiles routes on demand: the first visit may take over 5s
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chrome",
      // Use the system-installed Google Chrome
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { DATABASE_URL: E2E_DATABASE_URL },
  },
});
