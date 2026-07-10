// (c) Proves the teacher's random name caller never repeats a name until
// the "Reset called list" button is used, and correctly alerts once the
// whole roster has been called.
const { test, expect } = require('@playwright/test');
const { joinAsTeacher, randomCode } = require('./helpers');

test.describe('random name caller', () => {
  test('cycles through the whole roster with no repeats, then alerts, then resets cleanly', async ({ page }) => {
    const code = randomCode();
    await joinAsTeacher(page, code);

    const roster = ['Ama Owusu', 'Ben Silva', 'Chen Wei', 'Divya Rao'];
    await page.fill('#rosterTextarea', roster.join('\n'));
    await page.click('#btnSaveRoster');
    await expect(page.locator('#rosterCount')).toHaveText('4 names saved');

    const called = [];
    for (let i = 0; i < roster.length; i++) {
      await page.click('#btnCallSomeone');
      const name = await page.locator('#calledNameDisplay').innerText();
      expect(roster).toContain(name);
      expect(called).not.toContain(name); // never repeats until reset
      called.push(name);
    }
    expect(new Set(called).size).toBe(roster.length); // covered everyone exactly once

    // One more call once everyone's been called must alert, not silently repeat.
    let alertMessage = null;
    page.once('dialog', async (dialog) => { alertMessage = dialog.message(); await dialog.dismiss(); });
    await page.click('#btnCallSomeone');
    await expect.poll(() => alertMessage).toContain('Everyone has been called');

    // Reset should allow the full roster to be called again.
    await page.click('#btnResetCalled');
    await expect(page.locator('#calledProgress')).toHaveText('0 / 4 called');

    const secondRound = [];
    for (let i = 0; i < roster.length; i++) {
      await page.click('#btnCallSomeone');
      const name = await page.locator('#calledNameDisplay').innerText();
      expect(secondRound).not.toContain(name);
      secondRound.push(name);
    }
    expect(new Set(secondRound).size).toBe(roster.length);
  });

  test('"Reset everything" also clears the called list (and submissions/phase)', async ({ page }) => {
    const code = randomCode();
    await joinAsTeacher(page, code);

    await page.fill('#rosterTextarea', 'Solo Name');
    await page.click('#btnSaveRoster');
    await page.click('#btnCallSomeone');
    await expect(page.locator('#calledProgress')).toHaveText('1 / 1 called');

    await page.click('text=Danger zone');
    page.once('dialog', (d) => d.accept());
    await page.click('#btnResetEverything');

    await expect(page.locator('#calledNameDisplay')).toHaveText('—');
    await expect(page.locator('#statSubmissions')).toHaveText('0');
  });
});
