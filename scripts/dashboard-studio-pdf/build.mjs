// ─── Build the Dashboard Design Studio PDF ────────────────────────────────
// Writes the activity pack to public/mbi806b/dashboard-studio/, where the
// /dashboard-design-studio page links to it. It is made from the same data as
// the page (src/components/public/dashboard/studio.ts), so rebuild it whenever
// a scenario changes:
//
//   npm --prefix study-pack ci        # once, for Playwright
//   node scripts/dashboard-studio-pdf/build.mjs
//
// How it works: esbuild bundles document.tsx (which renders the document with
// react-dom/server), print.css is added with its fonts inlined, and Chromium
// prints it to PDF. The fonts are the ones the ER tutorial PDF already ships
// (scripts/er-tutorial-pdf/fonts). Set DASHBOARD_PDF_CHROMIUM to use a
// particular Chromium binary.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const fontDir = path.join(root, 'scripts/er-tutorial-pdf/fonts');
const outDir = path.join(root, 'public/mbi806b/dashboard-studio');
const outName = 'MBI806B-Dashboard-Design-Studio.pdf';

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
  if (process.env.DASHBOARD_PDF_CHROMIUM) return { executablePath: process.env.DASHBOARD_PDF_CHROMIUM };
  try {
    fs.accessSync(chromium.executablePath());
    return {};
  } catch {
    return fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
  }
}

/** print.css with each font file inlined, so the page needs no other files. */
function css() {
  return fs.readFileSync(path.join(here, 'print.css'), 'utf8').replace(/url\('fonts\/([^']+)'\)/g, (_, file) => {
    const data = fs.readFileSync(path.join(fontDir, file)).toString('base64');
    return `url(data:font/woff2;base64,${data})`;
  });
}

async function loadDocument() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-studio-'));
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
  const { activityDoc } = await loadDocument();
  const { chromium } = loadPlaywright();
  const doc = activityDoc();
  const footer = `@page { @bottom-left { content: ${JSON.stringify(doc.footer)}; } }`;
  const htmlText = doc.html.replace('/*CSS*/', `${css()}\n${footer}`);

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(launchOptions(chromium));
  try {
    const page = await browser.newPage({ viewport: { width: 700, height: 1000 } });
    await page.emulateMedia({ media: 'print' });
    await page.setContent(htmlText, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, outName);
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
    await page.close();
    console.log(`wrote ${path.relative(root, file)}`);
    if (process.env.DASHBOARD_PDF_KEEP_HTML) fs.writeFileSync(file.replace(/\.pdf$/, '.html'), htmlText);
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
