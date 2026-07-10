// (b) Proves the character-count gating actually disables/enables submit
// buttons correctly for both the conflict textarea (400 char minimum) and
// the five post-shuffle analysis fields (80 char minimum each), and that
// the shuffle phase change propagates to student tabs live (no reload).
const { test, expect } = require('@playwright/test');
const { joinAsStudent, joinAsTeacher, randomCode } = require('./helpers');

const SHORT_TEXT = 'This conflict was too short to count.'; // < 400 chars
const LONG_CONFLICT = 'A'.repeat(400) + ' — a conflict about missed deadlines on a group project, ' +
  'where one teammate consistently under-communicated blockers until the night before the deadline.';
const LONG_ANALYSIS = 'B'.repeat(80) + ' this is a sufficiently long analysis answer for gating.';

const ANALYSIS_FIELDS = [
  '#rootCauseInput',
  '#stakeholdersInput',
  '#modeUsedInput',
  '#betterModeInput',
  '#preventionInput',
];

async function fillAllAnalysisFields(page) {
  for (const selector of ANALYSIS_FIELDS) {
    await page.fill(selector, LONG_ANALYSIS);
  }
}

test.describe('character-count gating', () => {
  test('conflict textarea: submit stays disabled under 400 chars, enables at/above it, counter color flips', async ({ page }) => {
    const code = randomCode();
    await joinAsStudent(page, code);

    const textarea = page.locator('#conflictTextarea');
    const counter = page.locator('#conflictCounter');
    const submit = page.locator('#btnSubmitConflict');

    await expect(submit).toBeDisabled();

    await textarea.fill(SHORT_TEXT);
    await expect(counter).toHaveClass(/warn/);
    await expect(counter).not.toHaveClass(/confirm/);
    await expect(submit).toBeDisabled();

    await textarea.fill(LONG_CONFLICT);
    await expect(counter).toHaveClass(/confirm/);
    await expect(counter).not.toHaveClass(/warn/);
    await expect(submit).toBeEnabled();

    // Dropping back below threshold must re-disable it — gating is live, not one-shot.
    await textarea.fill(SHORT_TEXT);
    await expect(submit).toBeDisabled();
  });

  test('analysis fields: all five must independently clear 80 chars before submit enables', async ({ context }) => {
    const code = randomCode();
    const teacher = await context.newPage();
    const studentA = await context.newPage();
    const studentB = await context.newPage();

    await joinAsTeacher(teacher, code);
    await joinAsStudent(studentA, code);
    await joinAsStudent(studentB, code);

    await studentA.fill('#conflictTextarea', LONG_CONFLICT + ' from student A');
    await studentA.click('#btnSubmitConflict');
    await studentB.fill('#conflictTextarea', LONG_CONFLICT + ' from student B');
    await studentB.click('#btnSubmitConflict');

    await expect(teacher.locator('#statSubmissions')).toHaveText('2');

    teacher.once('dialog', (d) => d.dismiss());
    await teacher.click('#btnShuffle');

    // Live reactivity: both students should flip to the shuffled form without reloading.
    await expect(studentA.locator('#shuffledForm')).toBeVisible({ timeout: 5000 });
    await expect(studentB.locator('#shuffledForm')).toBeVisible({ timeout: 5000 });

    const submit = studentA.locator('#btnSubmitAnalysis');
    await expect(submit).toBeDisabled();

    // Fill the fields one at a time — submit must stay disabled until the
    // very last one clears the threshold.
    for (let i = 0; i < ANALYSIS_FIELDS.length; i++) {
      await studentA.fill(ANALYSIS_FIELDS[i], LONG_ANALYSIS);
      if (i < ANALYSIS_FIELDS.length - 1) {
        await expect(submit).toBeDisabled(); // only i+1 of 5 fields filled
      }
    }
    await expect(submit).toBeEnabled(); // all 5 filled — now enabled

    // Clearing one field must re-disable it.
    await studentA.fill('#rootCauseInput', 'too short');
    await expect(submit).toBeDisabled();
  });

  test('assigned conflict is never the student\'s own submission (end-to-end, not just unit-level)', async ({ context }) => {
    const code = randomCode();
    const teacher = await context.newPage();
    const studentA = await context.newPage();
    const studentB = await context.newPage();

    await joinAsTeacher(teacher, code);
    await joinAsStudent(studentA, code);
    await joinAsStudent(studentB, code);

    const textA = LONG_CONFLICT + ' — unique marker AAA123';
    const textB = LONG_CONFLICT + ' — unique marker BBB456';
    await studentA.fill('#conflictTextarea', textA);
    await studentA.click('#btnSubmitConflict');
    await studentB.fill('#conflictTextarea', textB);
    await studentB.click('#btnSubmitConflict');

    teacher.once('dialog', (d) => d.dismiss());
    await teacher.click('#btnShuffle');

    await expect(studentA.locator('#assignedText')).toBeVisible({ timeout: 5000 });
    const assignedToA = await studentA.locator('#assignedText').innerText();
    const assignedToB = await studentB.locator('#assignedText').innerText();

    expect(assignedToA).not.toContain('AAA123');
    expect(assignedToA).toContain('BBB456');
    expect(assignedToB).not.toContain('BBB456');
    expect(assignedToB).toContain('AAA123');
  });

  test('teacher dashboard shows the ticket-to-ticket assignment map and flips to "Done" once an analysis is submitted', async ({ context }) => {
    const code = randomCode();
    const teacher = await context.newPage();
    const studentA = await context.newPage();
    const studentB = await context.newPage();

    await joinAsTeacher(teacher, code);
    await joinAsStudent(studentA, code);
    await joinAsStudent(studentB, code);

    // Before shuffling, the teacher sees the empty state, not a table.
    await expect(teacher.locator('#assignmentsEmpty')).toBeVisible();
    await expect(teacher.locator('#assignmentsTable')).toBeHidden();

    await studentA.fill('#conflictTextarea', LONG_CONFLICT + ' from student A');
    await studentA.click('#btnSubmitConflict');
    const ticketA = await studentA.locator('#waitingTicket').innerText();
    await studentB.fill('#conflictTextarea', LONG_CONFLICT + ' from student B');
    await studentB.click('#btnSubmitConflict');
    const ticketB = await studentB.locator('#waitingTicket').innerText();

    teacher.once('dialog', (d) => d.dismiss());
    await teacher.click('#btnShuffle');

    // After shuffling with exactly 2 submissions, each is assigned to the other.
    await expect(teacher.locator('#assignmentsTable')).toBeVisible({ timeout: 5000 });
    await expect(teacher.locator('#assignmentsEmpty')).toBeHidden();
    const rows = teacher.locator('#assignmentsBody tr');
    await expect(rows).toHaveCount(2);
    const rowTexts = await rows.allInnerTexts();
    expect(rowTexts.some((r) => r.includes(ticketA) && r.includes(ticketB))).toBe(true);
    expect(rowTexts.some((r) => r.includes(ticketB) && r.includes(ticketA))).toBe(true);
    expect(rowTexts.every((r) => r.includes('Pending'))).toBe(true);

    // Student A is reviewing B's conflict (2-submission shuffle always swaps
    // the pair), so once A submits their analysis, submission B's row —
    // keyed by conflict ticket B, not A — should flip to Done live.
    await expect(studentA.locator('#shuffledForm')).toBeVisible({ timeout: 5000 });
    await fillAllAnalysisFields(studentA);
    await studentA.click('#btnSubmitAnalysis');

    await expect(async () => {
      const cells = await teacher.locator('#assignmentsBody tr').evaluateAll((trs) =>
        trs.map((tr) => Array.from(tr.children).map((td) => td.textContent))
      );
      const rowForConflictB = cells.find((row) => row[0] === ticketB);
      expect(rowForConflictB[2]).toBe('Done');
    }).toPass({ timeout: 5000 });
  });
});
