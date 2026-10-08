// ─── Build the ER Diagram Tutorial PDFs ───────────────────────────────────
// Writes the tutorial and its answers, as two separate PDFs, to
// public/mbi802/er-tutorial/, where the /er-first-steps page links to them.
// Both are made from the same data as the page (src/components/public/er/),
// so rebuild them whenever a task changes:
//
//   npm --prefix study-pack ci        # once, for Playwright
//   node scripts/er-tutorial-pdf/build.mjs
//
// How it works: esbuild bundles document.tsx (which renders the documents
// with react-dom/server), print.css is added with its fonts inlined, and
// Chromium prints each document to PDF. Set ER_PDF_CHROMIUM to use a
// particular Chromium binary.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const outDir = path.join(root, 'public/mbi802/er-tutorial');

function loadPlaywright() {
  for (const pkg of ['package.json', 'study-pack/package.json']) {
    try {
      return createRequire(path.join(root, pkg))('playwright');
    } catch {
      // try the next place
    }
  }
  throw new Error('Playwright not found. Run `npm --prefix study-pack ci` first.');
}

function launchOptions(chromium) {
  if (process.env.ER_PDF_CHROMIUM) return { executablePath: process.env.ER_PDF_CHROMIUM };
  try {
    fs.accessSync(chromium.executablePath());
    return {};
  } catch {
    return fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
  }
}

// A4 portrait text area, from the @page margins in print.css.
const MM = 96 / 25.4;
const CONTENT_W = 210 - 17 - 17;
const CONTENT_H = 297 - 16 - 18;

/** Runs in the page: stretch each task's ruled working space down to the
 *  bottom of its page. Each task starts on a new page, so the space left is
 *  the page height minus everything above the box. */
function fillWorkingSpace({ mm, usable }) {
  for (const box of document.querySelectorAll('.working')) {
    const task = box.closest('.task');
    const above = box.getBoundingClientRect().top - task.getBoundingClientRect().top;
    const free = usable * mm - above - 6 * mm;
    if (free > 40 * mm) box.style.height = `${free}px`;
  }
}

/** print.css with each font file inlined, so the page needs no other files. */
function css() {
  return fs.readFileSync(path.join(here, 'print.css'), 'utf8').replace(/url\('(fonts\/[^']+)'\)/g, (_, file) => {
    const data = fs.readFileSync(path.join(here, file)).toString('base64');
    return `url(data:font/woff2;base64,${data})`;
  });
}

async function loadDocuments() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'er-tutorial-'));
  const outfile = path.join(tmp, 'document.cjs');
  await build({
    entryPoints: [path.join(here, 'document.tsx')],
    outfile,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    jsx: 'automatic',
    logLevel: 'warning',
  });
  const mod = createRequire(import.meta.url)(outfile);
  fs.rmSync(tmp, { recursive: true, force: true });
  return mod;
}

async function main() {
  const { tutorialDoc, answersDoc } = await loadDocuments();
  const { chromium } = loadPlaywright();
  const style = css();

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(launchOptions(chromium));
  try {
    for (const [name, doc] of [
      ['MBI802-ER-Diagram-Tutorial.pdf', tutorialDoc()],
      ['MBI802-ER-Diagram-Tutorial-Answers.pdf', answersDoc()],
    ]) {
      const footer = `@page { @bottom-left { content: ${JSON.stringify(doc.footer)}; } }`;
      const htmlText = doc.html.replace('/*CSS*/', `${style}\n${footer}`);
      // Lay the page out at the printed text width, so the measuring below
      // sees the same line breaks as the PDF.
      const page = await browser.newPage({ viewport: { width: Math.round(CONTENT_W * MM), height: 1200 } });
      await page.emulateMedia({ media: 'print' });
      await page.setContent(htmlText, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(fillWorkingSpace, { mm: MM, usable: CONTENT_H });
      const file = path.join(outDir, name);
      await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
      await page.close();
      console.log(`wrote ${path.relative(root, file)}`);
      if (process.env.ER_PDF_KEEP_HTML) fs.writeFileSync(file.replace(/\.pdf$/, '.html'), htmlText);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
