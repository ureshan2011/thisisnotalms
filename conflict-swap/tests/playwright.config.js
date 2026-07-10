const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  fullyParallel: false, // tests share a local http server; keep it simple/serial
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:8811',
    // This environment ships a pre-installed Chromium at a fixed path rather
    // than the one `playwright install` would fetch — point at it directly
    // so tests don't try (and fail) to download a browser.
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium',
    },
  },
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:8811/conflict-swap.html',
    reuseExistingServer: !process.env.CI,
    timeout: 10_000,
  },
});
