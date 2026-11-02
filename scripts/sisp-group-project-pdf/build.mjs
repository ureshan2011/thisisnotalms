// ─── Build the MBI800 SISP group project PDFs ─────────────────────────────
// Writes the group project tutorial and the peer rating sheet to
// public/mbi800/group-project/, where the /mbi800 course page links to them.
//
//   npm --prefix study-pack ci        # once, for Playwright
//   node scripts/sisp-group-project-pdf/build.mjs
//
// Both documents are plain HTML in this folder. print.css is added with the
// DM Sans fonts inlined (borrowed from scripts/er-tutorial-pdf/fonts) and
// Chromium prints each one to an A4 PDF. Set SISP_PDF_CHROMIUM to use a
// particular Chromium binary, and SISP_PDF_KEEP_HTML=1 to keep the HTML next
// to each PDF for checking the layout in a browser.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const fontDir = path.join(root, 'scripts/er-tutorial-pdf');
const outDir = path.join(root, 'public/mbi800/group-project');

const DOCUMENTS = [
  {
    source: 'tutorial.html',
    file: 'MBI800-SISP-Group-Project-Tutorial.pdf',
    footer: 'MBI800 · SISP Group Project Tutorial',
  },
  {
    source: 'rating-sheet.html',
    file: 'MBI800-SISP-Group-Project-Peer-Rating-Sheet.pdf',
    footer: 'MBI800 · SISP Group Project Peer Rating Sheet',
  },
];

function loadPlaywright() {
  for (const pkg of ['package.json', 'study-pack/package.json']) {
    try {
      return createRequire(path.join(root, pkg))('playwright');
    } catch {
      // try the next place
    }
  }
  return createRequire(import.meta.url)('playwright');
}

function launchOptions(chromium) {
  if (process.env.SISP_PDF_CHROMIUM) return { executablePath: process.env.SISP_PDF_CHROMIUM };
  try {
    fs.accessSync(chromium.executablePath());
    return {};
  } catch {
    return fs.existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {};
  }
}

/** print.css with each font file inlined, so the page needs no other files. */
function css() {
  return fs.readFileSync(path.join(here, 'print.css'), 'utf8').replace(/url\('(fonts\/[^']+)'\)/g, (_, file) => {
    const data = fs.readFileSync(path.join(fontDir, file)).toString('base64');
    return `url(data:font/woff2;base64,${data})`;
  });
}

async function main() {
  const { chromium } = loadPlaywright();
  const style = css();

  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch(launchOptions(chromium));
  try {
    for (const doc of DOCUMENTS) {
      const footer = `@page { @bottom-left { content: ${JSON.stringify(doc.footer)}; } }`;
      const html = fs.readFileSync(path.join(here, doc.source), 'utf8').replace('/*CSS*/', `${style}\n${footer}`);
      const page = await browser.newPage();
      await page.emulateMedia({ media: 'print' });
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const file = path.join(outDir, doc.file);
      await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
      await page.close();
      console.log(`wrote ${path.relative(root, file)}`);
      if (process.env.SISP_PDF_KEEP_HTML) fs.writeFileSync(file.replace(/\.pdf$/, '.html'), html);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
