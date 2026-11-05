// ─── SQL Sandbox: where student progress is saved ─────────────────────────
// Paste the Google Apps Script web app URL between the quotes below (it ends
// in /exec). Setup steps: scripts/sql-sandbox-sheet/README.md.
//
// Left empty, the sandbox still works: progress stays on each device only,
// and a student who moves to a new device starts again.

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycby8FFJeaiKKtcDD2h3xo_OBXACrOzOwSqCAVKw9xOrWiW8X5EOCg-uuW5D9aIisXaatCw/exec';

export const SQL_SANDBOX_SHEET_URL: string =
  SHEET_URL || ((import.meta.env.VITE_SQL_SANDBOX_SHEET_URL as string | undefined) ?? '');
