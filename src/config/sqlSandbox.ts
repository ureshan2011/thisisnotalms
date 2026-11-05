// ─── SQL Sandbox: where student progress is saved ─────────────────────────
// Paste the Google Apps Script web app URL between the quotes below (it ends
// in /exec). Setup steps: scripts/sql-sandbox-sheet/README.md.
//
// Left empty, the sandbox still works: progress stays on each device only,
// and a student who moves to a new device starts again.

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbzK1FjrrlxbSLEx-585qvgs-FCuNVACT3Ah8b46pbzpyXX56XM_Gn_Z9coJeOMNmWSwsg/exec';

export const SQL_SANDBOX_SHEET_URL: string =
  SHEET_URL || ((import.meta.env.VITE_SQL_SANDBOX_SHEET_URL as string | undefined) ?? '');
