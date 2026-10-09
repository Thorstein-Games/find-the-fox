import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the real static export and a real megingjord
 * server (checked out as a sibling directory, like sheeple-game's e2e).
 * Run `pnpm build` first; `pnpm test:e2e` does both.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } } : {}),
  },
  webServer: [
    {
      command: 'pnpm dev',
      cwd: '../megingjord',
      port: 2567,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'node scripts/serve-static.mjs out 3000',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
