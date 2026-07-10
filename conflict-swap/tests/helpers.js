// Shared test helpers. Local demo mode (used throughout this suite, since
// firebaseConfig ships with PASTE_YOUR_* placeholders) never touches the
// Firebase SDK or Google Fonts, so we abort those third-party requests
// before navigating — this keeps tests fast and immune to CDN/proxy
// flakiness in CI sandboxes instead of waiting on the page's `load` event
// to settle every external resource.
async function gotoApp(page) {
  await page.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|www\.gstatic\.com)\//, (route) =>
    route.abort()
  );
  await page.goto('/conflict-swap.html');
}

function randomCode() {
  return 'T' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

module.exports = { gotoApp, randomCode };
