// Shared test helpers. The page ships with a real Firebase config wired in
// (see public/conflict-swap.html), so ?localDemo=1 forces the local fake
// backend instead — keeping this suite fast, deterministic, and offline
// instead of writing test data into the real production Firestore. That
// also means the Firebase SDK is never actually used here, so we abort
// those CDN requests (and Google Fonts) before navigating rather than
// waiting on the page's `load` event to settle every external resource.
async function gotoApp(page) {
  await page.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)\//, (route) =>
    route.abort()
  );
  await page.goto('/conflict-swap.html?localDemo=1');
}

function randomCode() {
  return 'T' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

module.exports = { gotoApp, randomCode };
