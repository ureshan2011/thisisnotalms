# SQL Sandbox: saving progress to a Google Sheet

The sandbox at `/sql-sandbox` works without this. Progress is kept on each
student's device either way. Set this up when you want:

- one sheet showing every student's progress, live, during class
- students to get their progress back on a new phone or laptop by typing
  the same student ID
- the "Top of the class" board on the Learn tab

It takes about five minutes.

## 1. Make the sheet

1. Create a new Google Sheet. Call it something like `MBI802 SQL Sandbox`.
2. **Extensions → Apps Script**.
3. Delete what's in `Code.gs` and paste in the whole of `Code.gs` from this
   folder. Save.

## 2. Publish it as a web app

1. **Deploy → New deployment**.
2. Click the cog next to "Select type" and pick **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**.
4. **Deploy**, and allow access when Google asks (it is your own script).
5. Copy the **Web app URL**. It ends in `/exec`.

Open that URL in a browser. You should see
`{"ok":true,"hello":"SQL Sandbox sheet is running"}`.

## 3. Point the sandbox at it

Paste the URL into `src/config/sqlSandbox.ts`:

```ts
const SHEET_URL = 'https://script.google.com/macros/s/…/exec';
```

Then build and deploy the site as usual.

## What you'll see

Two tabs appear after the first student opens the sandbox:

- **Progress**: one row per student ID. Last seen, XP, levels done, the level
  they're up to, challenges solved, how many tries, and how many times they
  pasted into a challenge editor. Sort by "Up to" in class to find who is
  stuck. The last column is the saved profile; leave it alone.
- **Log**: one row per event, newest at the bottom. A challenge solved in very
  few seconds, straight after a paste, is worth a two-minute chat.

## Good to know

- There are no passwords. Anyone with the web app URL could write a row for
  any ID. For a classroom practice tool that's an acceptable trade for "no
  logins". Don't use the sheet for marks without the TA's in-person check.
- If you change `Code.gs` later, use **Deploy → Manage deployments → Edit →
  Version: New version**, so the URL stays the same.
- To start a new cohort, make a new sheet and a new deployment, and swap the
  URL.
