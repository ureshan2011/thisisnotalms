/* Verify the built PDFs: encryption present, passwords enforced, permission
   bits set, watermark text on sampled pages, page-count budgets, master TOC. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import { distDirs } from './paths.mjs';

let getDocument, PasswordResponses, PermissionFlag;
async function loadPdfjs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  ({ getDocument, PasswordResponses, PermissionFlag } = pdfjs);
}

async function extractPageText(doc, pageNumber) {
  const page = await doc.getPage(pageNumber);
  const content = await page.getTextContent();
  return content.items.map((i) => i.str).join(' ');
}

/* Letter-spaced text (headers, watermark) extracts with spaces between
   glyphs — compare with all whitespace and punctuation stripped, so a title
   with a colon or em dash in its frontmatter still matches the plainer
   fileTitle-derived string the TOC check searches for. */
const normalize = (s) =>
  s.toLowerCase().replace(/&(amp;)?/g, 'and').replace(/[:,–—/-]/g, '').replace(/\s+/g, '');
const textIncludes = (haystack, needle) => normalize(haystack).includes(normalize(needle));

export async function verifyAll(built, course, { encrypted, userPassword }) {
  await loadPdfjs();
  const problems = [];
  const warnings = [];
  const manifest = [];

  for (const item of built) {
    const name = item.pdfName;
    const bytes = fs.readFileSync(item.pdf);
    const raw = bytes.toString('latin1');

    if (bytes.length < 50_000) {
      problems.push(`${name}: suspiciously small (${bytes.length} bytes)`);
    }

    if (encrypted) {
      if (!raw.includes('/Encrypt')) problems.push(`${name}: no /Encrypt dictionary`);
      // Opening without a password must fail.
      try {
        await getDocument({ data: new Uint8Array(bytes) }).promise;
        problems.push(`${name}: opened WITHOUT a password — encryption not enforced`);
      } catch (err) {
        if (err?.name !== 'PasswordException') {
          problems.push(`${name}: unexpected error opening without password: ${err}`);
        }
      }
    }

    let doc;
    try {
      doc = await getDocument({
        data: new Uint8Array(bytes),
        password: encrypted ? userPassword : undefined,
      }).promise;
    } catch (err) {
      problems.push(`${name}: failed to open with user password: ${err}`);
      continue;
    }

    if (encrypted) {
      // The encryption backend must round-trip metadata strings: a broken
      // backend garbles the Info title and outline entries, which viewers
      // then display as mojibake or "undefined".
      // Mis-decrypted strings show up as empty, letterless, or laced with
      // control characters — legitimate titles may contain ’ → — etc.
      const garbled = (t) => !t || /[\x00-\x1F\x7F�]/.test(t) || !/[A-Za-z]/.test(t);
      const expectedTitle = name.replace(/\.pdf$/, '').replace(/-/g, ' ');
      const info = (await doc.getMetadata()).info;
      if (info.Title !== expectedTitle) {
        problems.push(`${name}: document title corrupted by encryption — got ${JSON.stringify(info.Title)}`);
      }
      const outline = (await doc.getOutline()) || [];
      const flat = [];
      const walk = (items) => items.forEach((o) => { flat.push(o.title); walk(o.items || []); });
      walk(outline);
      if (!flat.length) {
        warnings.push(`${name}: no bookmarks/outline in encrypted PDF`);
      } else if (flat.some(garbled)) {
        problems.push(
          `${name}: bookmark titles corrupted by encryption — ${JSON.stringify(flat.filter(garbled).slice(0, 3))}`
        );
      }

      const perms = await doc.getPermissions();
      if (!perms) {
        problems.push(`${name}: no permission flags reported`);
      } else {
        if (perms.includes(PermissionFlag.COPY))
          problems.push(`${name}: COPY permission is allowed`);
        if (perms.includes(PermissionFlag.MODIFY_CONTENTS))
          problems.push(`${name}: MODIFY_CONTENTS permission is allowed`);
      }
    }

    const n = doc.numPages;
    if (item.pageCount && n !== item.pageCount) {
      warnings.push(`${name}: Paged.js reported ${item.pageCount} pages, PDF has ${n}`);
    }
    if (item.kind === 'revision' && n > (item.maxPages || 2)) {
      problems.push(`${name}: revision sheet is ${n} pages (budget ${item.maxPages || 2})`);
    }
    if (item.kind === 'guide' && n < 4) {
      warnings.push(`${name}: study guide only ${n} pages — thin?`);
    }

    // No page may contain interpolation junk from a bad data binding.
    // (Word-bounded and case-sensitive: lesson 7's "determinant" contains "nan".)
    const junk = /\b(?:undefined|NaN|null)\b|\[object /;
    for (let p = 1; p <= n; p++) {
      const text = await extractPageText(doc, p);
      if (junk.test(text)) {
        problems.push(`${name} p.${p}: template junk in rendered text (${junk.exec(text)[0]})`);
      }
    }

    // Watermark + footer text on sampled pages (skip page 1 of master = cover).
    const sample = [...new Set([item.kind === 'master' ? 2 : 1, Math.ceil(n / 2), n])].filter(
      (p) => p >= 1 && p <= n
    );
    for (const p of sample) {
      const text = await extractPageText(doc, p);
      for (const needle of [course.notice, course.code, course.author, course.academicYear]) {
        if (!textIncludes(text, needle)) {
          problems.push(`${name} p.${p}: missing watermark/footer text "${needle}"`);
        }
      }
    }

    if (item.kind === 'master') {
      // The TOC can span more than 2 pages once a course has many chapters
      // with sub-entries; sample generously rather than hardcoding a length.
      const tocPageEnd = Math.min(n, 6);
      let tocText = '';
      for (let p = 2; p <= tocPageEnd; p++) tocText += ' ' + (await extractPageText(doc, p));
      for (const lesson of course.lessons) {
        const { title } = manifestTitle(course, lesson);
        if (!textIncludes(tocText, title)) {
          problems.push(`master TOC: missing chapter entry "${title}"`);
        }
      }
      const annots = await (await doc.getPage(2)).getAnnotations();
      const links = annots.filter((a) => a.subtype === 'Link');
      if (!links.length) {
        warnings.push('master: no link annotations on TOC page (Chromium tagged-link limitation) — printed page numbers still present');
      }
    }

    manifest.push({
      file: name,
      pages: n,
      bytes: bytes.length,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    });
    await doc.destroy();
  }

  return { problems, warnings, manifest };
}

function manifestTitle(course, lesson) {
  return { title: lesson.fileTitle.replace(/-/g, ' ') };
}

export function writeManifest(manifest, extra, slug) {
  const out = {
    generatedAt: new Date().toISOString(),
    ...extra,
    files: manifest,
  };
  fs.writeFileSync(distDirs(slug).manifest, JSON.stringify(out, null, 2));
}
