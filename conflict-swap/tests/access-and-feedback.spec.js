// (d) Proves the teacher panel's instructor-password gate actually blocks
// wrong passwords, the shareable read-only class dashboard (?board=CODE)
// mirrors live session state, and instructor feedback written in the teacher
// review card reaches the analyzing student's done screen without a reload.
const { test, expect } = require('@playwright/test');
const { gotoApp, gotoBoard, joinAsStudent, joinAsTeacher, randomCode, TEACHER_PASSWORD } = require('./helpers');

const LONG_CONFLICT = 'A'.repeat(400) + ' — a conflict about scope creep on a client project, ' +
  'where the sponsor kept adding features verbally without ever updating the scope baseline.';
const LONG_ANALYSIS = 'B'.repeat(80) + ' this is a sufficiently long analysis answer for gating.';

async function submitFullAnalysis(page) {
  for (const selector of ['#rootCauseInput', '#stakeholdersInput', '#modeUsedInput', '#betterModeInput', '#preventionInput']) {
    await page.fill(selector, LONG_ANALYSIS);
  }
  await page.click('#btnSubmitAnalysis');
}

test.describe('teacher gate, shared dashboard, and feedback', () => {
  test('teacher panel rejects a wrong password and opens with the right one', async ({ page }) => {
    const code = randomCode();
    await gotoApp(page);
    await page.fill('#classCodeInput', code);

    // Password field only appears after choosing the teacher role.
    await expect(page.locator('#teacherPassRow')).toBeHidden();
    await page.click('#btnTeacher');
    await expect(page.locator('#teacherPassRow')).toBeVisible();

    await page.fill('#teacherPassInput', 'wrong-password');
    await page.click('#btnTeacherPassGo');
    await expect(page.locator('#teacherPassError')).toBeVisible();
    await expect(page.locator('#teacherView')).toBeHidden();

    await page.fill('#teacherPassInput', TEACHER_PASSWORD);
    await page.click('#btnTeacherPassGo');
    await expect(page.locator('#teacherView')).toBeVisible();
    await expect(page.locator('#teacherClassCode')).toHaveText(code);
  });

  test('shared dashboard mirrors submissions, analyses, phase, and cold calls live', async ({ context }) => {
    const code = randomCode();
    const teacher = await context.newPage();
    const studentA = await context.newPage();
    const studentB = await context.newPage();
    const board = await context.newPage();

    await joinAsTeacher(teacher, code);
    await joinAsStudent(studentA, code);
    await joinAsStudent(studentB, code);
    await gotoBoard(board, code);

    await expect(board.locator('#boardClassCode')).toHaveText(code);
    await expect(board.locator('#boardPhasePill')).toHaveText('Writing phase');
    await expect(board.locator('#boardSubmissions')).toHaveText('0');

    await studentA.fill('#conflictTextarea', LONG_CONFLICT + ' from student A');
    await studentA.click('#btnSubmitConflict');
    await studentB.fill('#conflictTextarea', LONG_CONFLICT + ' from student B');
    await studentB.click('#btnSubmitConflict');
    await expect(board.locator('#boardSubmissions')).toHaveText('2');

    teacher.once('dialog', (d) => d.dismiss());
    await teacher.click('#btnShuffle');
    await expect(board.locator('#boardPhasePill')).toHaveText('Analysis phase');

    await expect(studentA.locator('#shuffledForm')).toBeVisible({ timeout: 5000 });
    await submitFullAnalysis(studentA);
    await expect(board.locator('#boardAnalyses')).toHaveText('1');

    // Cold calls show up on the dashboard, by name — that part is public anyway.
    await teacher.fill('#rosterTextarea', 'Ama Owusu');
    await teacher.click('#btnSaveRoster');
    await teacher.click('#btnCallSomeone');
    await expect(board.locator('#boardCalledName')).toHaveText('Ama Owusu');
    await expect(board.locator('#boardCalledProgress')).toHaveText('1 of 1 called');
  });

  test('instructor feedback reaches the analyzing student live, without a reload', async ({ context }) => {
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

    teacher.once('dialog', (d) => d.dismiss());
    await teacher.click('#btnShuffle');

    // No analyses yet — the review card shows its empty state.
    await expect(teacher.locator('#reviewEmpty')).toBeVisible();

    await expect(studentA.locator('#shuffledForm')).toBeVisible({ timeout: 5000 });
    await submitFullAnalysis(studentA);
    await expect(studentA.locator('#doneScreen')).toBeVisible();
    await expect(studentA.locator('#feedbackBlock')).toBeHidden();

    // The teacher's review card now lists exactly one analysis.
    await expect(teacher.locator('#reviewEmpty')).toBeHidden();
    const item = teacher.locator('#reviewList details.review-item');
    await expect(item).toHaveCount(1);

    await item.locator('summary').click();
    const feedback = 'Sharp root-cause analysis. Next time, name the specific PMI mode instead of describing it.';
    await item.locator('textarea').fill(feedback);
    await item.locator('button').click();

    // The student's done screen shows the feedback live.
    await expect(studentA.locator('#feedbackBlock')).toBeVisible({ timeout: 5000 });
    await expect(studentA.locator('#feedbackText')).toHaveText(feedback);
    await expect(studentA.locator('#noFeedbackNote')).toBeHidden();

    // And the teacher's summary reflects that feedback was sent.
    await expect(teacher.locator('#reviewList .summary-tag')).toHaveText('Feedback sent');
  });
});
