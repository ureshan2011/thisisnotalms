// ─── Build the Dashboard Design Studio PDFs ───────────────────────────────
// Writes two PDFs to public/mbi806b/dashboard-studio/, where the
// /dashboard-design-studio page links to them:
//
//   MBI806B-Dashboard-Design-Studio.pdf   the activity pack (document.tsx)
//   MBI806B-Dashboard-Model-Answers.pdf   five model dashboards (model-answers.tsx)
//
// Both are made from the same data as the page
// (src/components/public/dashboard/studio.ts), so rebuild them whenever a
// scenario changes:
//
//   npm --prefix study-pack ci        # once, for Playwright
//   node scripts/dashboard-studio-pdf/build.mjs            # both
//   node scripts/dashboard-studio-pdf/build.mjs model      # just the model answers
//   node scripts/dashboard-studio-pdf/build.mjs pack       # just the activity pack
//
// How it works: esbuild bundles each document (which renders it with
// react-dom/server), its stylesheet is added with the fonts inlined, and
// Chromium prints it to PDF. The fonts are the ones the ER tutorial PDF already ships
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

/** A stylesheet with each font file inlined, so the page needs no other files. */
function css(file) {
  return fs.readFileSync(path.join(here, file), 'utf8').replace(/url\('fonts\/([^']+)'\)/g, (_, file) => {
    const data = fs.readFileSync(path.join(fontDir, file)).toString('base64');
    return `url(data:font/woff2;base64,${data})`;
  });
}

async function loadDocument(entry) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-studio-'));
  const outfile = path.join(tmp, 'document.cjs');
  await build({
    entryPoints: [path.join(here, entry)],
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

const JOBS = {
  pack: { entry: 'document.tsx', css: 'print.css', out: 'MBI806B-Dashboard-Design-Studio.pdf', width: 700 },
  model: { entry: 'model-answers.tsx', css: 'model.css', out: 'MBI806B-Dashboard-Model-Answers.pdf', width: 1920 },
};

async function main() {
  const which = process.argv[2];
  const jobs = which ? [which] : Object.keys(JOBS);
  const { chromium } = loadPlaywright();
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(launchOptions(chromium));
  try {
    for (const name of jobs) {
      const job = JOBS[name];
      if (!job) throw new Error(`Unknown job "${name}". Use "pack" or "model".`);
      const mod = await loadDocument(job.entry);
      let htmlText;
      if (name === 'pack') {
        const doc = mod.activityDoc();
        const footer = `@page { @bottom-left { content: ${JSON.stringify(doc.footer)}; } }`;
        htmlText = doc.html.replace('/*CSS*/', `${css(job.css)}\n${footer}`);
      } else {
        htmlText = mod.modelDoc().html.replace('/*CSS*/', css(job.css));
      }
      const page = await browser.newPage({ viewport: { width: job.width, height: 1000 } });
      await page.emulateMedia({ media: 'print' });
      await page.setContent(htmlText, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      if (name === 'model') {
        // The phone dashboard scrolls, so its page is as tall as its content.
        const h = await page.evaluate(() => Math.ceil(document.querySelector('.pg--t5').getBoundingClientRect().height));
        await page.addStyleTag({ content: `@page t5 { size: 390px ${h}px; margin: 0; } .pg--t5 { height: ${h}px; }` });
      }
      const file = path.join(outDir, job.out);
      await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
      await page.close();
      console.log(`wrote ${path.relative(root, file)}`);
      if (process.env.DASHBOARD_PDF_KEEP_HTML) fs.writeFileSync(file.replace(/\.pdf$/, '.html'), htmlText);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
