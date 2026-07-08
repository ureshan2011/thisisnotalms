/* Render assembled HTML documents to PDF with Playwright Chromium + Paged.js. */
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { distDirs } from './paths.mjs';

function launchOptions() {
  // Prefer the version-matched browser Playwright resolves itself; fall back
  // to an explicit executable (e.g. preinstalled /opt/pw-browsers/chromium in
  // sandboxed environments where versions may not match).
  const explicit = process.env.STUDY_PACK_CHROMIUM;
  if (explicit) return { executablePath: explicit };
  try {
    fs.accessSync(chromium.executablePath());
    return {};
  } catch {
    for (const candidate of ['/opt/pw-browsers/chromium']) {
      if (fs.existsSync(candidate)) return { executablePath: candidate };
    }
    return {};
  }
}

export async function renderAll(outputs, slug) {
  const pdfTmp = distDirs(slug).pdfTmp;
  fs.mkdirSync(pdfTmp, { recursive: true });
  const browser = await chromium.launch(launchOptions());
  try {
    const results = [];
    for (const out of outputs) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', (err) => errors.push(String(err)));
      await page.goto(pathToFileURL(out.html).href, { waitUntil: 'load' });
      try {
        await page.waitForFunction(
          '(window.__pagedDone !== undefined) || (window.__pagedError !== undefined)',
          { timeout: out.kind === 'master' ? 300_000 : 120_000 }
        );
      } catch (e) {
        throw new Error(
          `Timed out waiting for Paged.js on ${path.basename(out.html)}` +
            (errors.length ? `\nPage errors:\n${errors.join('\n')}` : '')
        );
      }
      const pagedError = await page.evaluate('window.__pagedError');
      if (pagedError) {
        throw new Error(`Paged.js failed on ${path.basename(out.html)}: ${pagedError}`);
      }
      const pageCount = await page.evaluate('window.__pagedDone');
      const pdfPath = path.join(pdfTmp, out.pdfName);
      await page.pdf({
        path: pdfPath,
        preferCSSPageSize: true,
        printBackground: true,
        displayHeaderFooter: false,
        tagged: true,
        outline: true,
      });
      await page.close();
      console.log(`  [render] ${out.pdfName} — ${pageCount} pages`);
      results.push({ ...out, pdfTmp: pdfPath, pageCount });
    }
    return results;
  } finally {
    await browser.close();
  }
}
