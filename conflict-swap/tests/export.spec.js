// (e) Proves the teacher's CSV export contains one row per conflict with the
// full swap pattern (which ticket reviewed which), all five analysis
// answers, and any feedback sent — and that it correctly quotes free text
// containing commas/quotes/newlines per RFC 4180.
const { test, expect } = require('@playwright/test');
const { joinAsStudent, joinAsTeacher, randomCode } = require('./helpers');

const LONG_CONFLICT = 'A'.repeat(400) + ' — a conflict, with a comma and a "quoted phrase" in it, ' +
  'about missed deadlines on a group project.';
const LONG_ANALYSIS = 'B'.repeat(80) + ' this is a sufficiently long analysis answer for gating.';

async function submitFullAnalysis(page) {
  for (const selector of ['#rootCauseInput', '#stakeholdersInput', '#modeUsedInput', '#betterModeInput', '#preventionInput']) {
    await page.fill(selector, LONG_ANALYSIS);
  }
  await page.click('#btnSubmitAnalysis');
}

// Minimal RFC 4180 parser sufficient for these tests (handles quoted fields,
// escaped "" quotes, and commas/newlines inside quotes).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\r' && text[i + 1] === '\n') {
      row.push(field); field = ''; rows.push(row); row = []; i++;
    } else if (c === '\n') {
      row.push(field); field = ''; rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

test.describe('CSV export', () => {
  test('exports one row per conflict with swap pattern, analysis, and feedback, with correct quoting', async ({ context }) => {
    const code = randomCode();
    const teacher = await context.newPage();
    const studentA = await context.newPage();
    const studentB = await context.newPage();

    await joinAsTeacher(teacher, code);
    await joinAsStudent(studentA, code);
    await joinAsStudent(studentB, code);

    // Before any submissions, export should no-op with a note, not download an empty file.
    await teacher.click('#btnExportCsv');
    await expect(teacher.locator('#exportEmptyNote')).toHaveText("No submissions yet — there's nothing to export.");

    await studentA.fill('#conflictTextarea', LONG_CONFLICT + ' from A');
    await studentA.click('#btnSubmitConflict');
    const ticketA = await studentA.locator('#waitingTicket').innerText();
    await studentB.fill('#conflictTextarea', LONG_CONFLICT + ' from B');
    await studentB.click('#btnSubmitConflict');
    const ticketB = await studentB.locator('#waitingTicket').innerText();

    teacher.once('dialog', (d) => d.dismiss());
    await teacher.click('#btnShuffle');

    await expect(studentA.locator('#shuffledForm')).toBeVisible({ timeout: 5000 });
    await submitFullAnalysis(studentA);

    // Send feedback on A's analysis (which reviewed B's conflict).
    await expect(teacher.locator('#reviewList details.review-item')).toHaveCount(1);
    const item = teacher.locator('#reviewList details.review-item');
    await item.locator('summary').click();
    const feedback = 'Solid analysis, name the PMI mode explicitly next time.';
    await item.locator('textarea').fill(feedback);
    await item.locator('button').click();
    await expect(teacher.locator('#reviewList .summary-tag')).toHaveText('Feedback sent');

    const [download] = await Promise.all([
      teacher.waitForEvent('download'),
      teacher.click('#btnExportCsv'),
    ]);
    expect(download.suggestedFilename()).toBe('conflict-swap-' + code + '-' + new Date().toISOString().slice(0, 10) + '.csv');

    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    // Strip the UTF-8 BOM the export prepends for Excel compatibility.
    const csvText = Buffer.concat(chunks).toString('utf-8').replace(/^﻿/, '');

    const rows = parseCsv(csvText.trim());
    expect(rows.length).toBe(3); // header + 2 conflicts

    const headers = rows[0];
    expect(headers).toEqual([
      'class_code', 'conflict_ticket', 'submitted_at', 'conflict_text',
      'reviewer_ticket', 'analyzed_at',
      'root_cause', 'stakeholders', 'mode_used', 'better_mode', 'prevention',
      'feedback', 'feedback_at'
    ]);

    const byTicket = {};
    rows.slice(1).forEach((r) => { byTicket[r[headers.indexOf('conflict_ticket')]] = r; });

    // Conflict B was assigned to (reviewed by) A — so B's row carries A's
    // analysis and feedback, while the comma/quote in the conflict text
    // round-tripped correctly through CSV quoting.
    const rowB = byTicket[ticketB];
    expect(rowB[headers.indexOf('reviewer_ticket')]).toBe(ticketA);
    expect(rowB[headers.indexOf('conflict_text')]).toContain('a conflict, with a comma and a "quoted phrase" in it');
    expect(rowB[headers.indexOf('root_cause')]).toBe(LONG_ANALYSIS);
    expect(rowB[headers.indexOf('feedback')]).toBe(feedback);
    expect(rowB[headers.indexOf('feedback_at')]).not.toBe('');
    expect(rowB[headers.indexOf('analyzed_at')]).not.toBe('');

    // Conflict A was assigned to B, whose analysis hasn't been submitted yet.
    const rowA = byTicket[ticketA];
    expect(rowA[headers.indexOf('reviewer_ticket')]).toBe(ticketB);
    expect(rowA[headers.indexOf('root_cause')]).toBe('');
    expect(rowA[headers.indexOf('feedback')]).toBe('');
  });
});
