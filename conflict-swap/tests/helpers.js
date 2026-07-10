// Shared test helpers. The page ships with a real Firebase config wired in
// (see public/conflict-swap.html), so ?localDemo=1 forces the local fake
// backend instead — keeping this suite fast, deterministic, and offline
// instead of writing test data into the real production Firestore. That
// also means the Firebase SDK is never actually used here, so we abort
// those CDN requests (and Google Fonts) before navigating rather than
// waiting on the page's `load` event to settle every external resource.

// The teacher panel's client-side gate (see TEACHER_PASSWORD in the page).
const TEACHER_PASSWORD = 'adminadmin';

async function blockExternal(page) {
  await page.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)\//, (route) =>
    route.abort()
  );
}

async function gotoApp(page) {
  await blockExternal(page);
  await page.goto('/conflict-swap.html?localDemo=1');
}

// Opens the shareable read-only class dashboard directly via its URL param.
async function gotoBoard(page, code) {
  await blockExternal(page);
  await page.goto('/conflict-swap.html?localDemo=1&board=' + code);
}

async function joinAsStudent(page, code) {
  await gotoApp(page);
  await page.fill('#classCodeInput', code);
  await page.click('#btnStudent');
}

async function joinAsTeacher(page, code) {
  await gotoApp(page);
  await page.fill('#classCodeInput', code);
  await page.click('#btnTeacher');
  await page.fill('#teacherPassInput', TEACHER_PASSWORD);
  await page.click('#btnTeacherPassGo');
}

function randomCode() {
  return 'T' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

module.exports = { gotoApp, gotoBoard, joinAsStudent, joinAsTeacher, randomCode, TEACHER_PASSWORD };
