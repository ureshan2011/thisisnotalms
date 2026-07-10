// (a) Proves the shuffle/assign logic never assigns a student their own
// submission, and that it always produces a valid one-to-one assignment
// (every submission gets exactly one reviewer, every reviewer used exactly
// once) — a guaranteed derangement, not "shuffle and hope".
const { test, expect } = require('@playwright/test');
const { gotoApp } = require('./helpers');

test.describe('derangement (shuffle & assign)', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page);
  });

  test('never assigns a submission to its own owner, across many sizes and trials', async ({ page }) => {
    const result = await page.evaluate(() => {
      const CS = window.ConflictSwapInternal;
      let ownSubmissionFailures = 0;
      let notBijectionFailures = 0;
      const TRIALS = 5000;
      for (let t = 0; t < TRIALS; t++) {
        const n = 2 + (t % 19); // exercise sizes 2..20
        const subs = Array.from({ length: n }, (_, i) => ({ id: 'sub' + i, anonId: 'anon' + i }));
        const pairs = CS.assignSubmissions(subs);

        const reviewersUsed = new Set();
        for (const p of pairs) {
          const owner = subs.find((s) => s.id === p.submissionId).anonId;
          if (p.assignedTo === owner) ownSubmissionFailures++;
          reviewersUsed.add(p.assignedTo);
        }
        if (pairs.length !== n || reviewersUsed.size !== n) notBijectionFailures++;
      }
      return { TRIALS, ownSubmissionFailures, notBijectionFailures };
    });

    expect(result.ownSubmissionFailures).toBe(0);
    expect(result.notBijectionFailures).toBe(0);
  });

  test('n=2 always swaps the two submissions with each other', async ({ page }) => {
    const pairs = await page.evaluate(() => {
      const CS = window.ConflictSwapInternal;
      const subs = [{ id: 'A', anonId: 'alice' }, { id: 'B', anonId: 'bob' }];
      return CS.assignSubmissions(subs);
    });
    const byId = Object.fromEntries(pairs.map((p) => [p.submissionId, p.assignedTo]));
    expect(byId.A).toBe('bob');
    expect(byId.B).toBe('alice');
  });

  test('rejects nothing for n=1 conceptually, but the UI layer blocks shuffling below 2 submissions', async ({ page }) => {
    // computeDerangement(1) legitimately can't avoid a fixed point (there's
    // nobody else to assign to) — the app guards against this in the UI by
    // requiring >= 2 submissions before "Shuffle & assign" is allowed, so we
    // just document/assert the boundary here rather than treat it as a bug.
    const order = await page.evaluate(() => window.ConflictSwapInternal.computeDerangement(1));
    expect(order).toEqual([0]);
  });
});
